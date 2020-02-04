import * as Joi from 'joi';
import * as _ from 'lodash';
import * as React from 'react';

import { useCreateCampaign } from '../../demand-campaigns/use';
import { useEvent } from '../../shared/use';

import { actions as actionsDemandCampaign } from '../../demand-campaigns/core';

export interface CampaignFormError {
  name: string;
  global_budget: string;
  country: string;
  brands: string;
}

export interface FieldsForm {
  name: string;
  global_budget?: number;
  country: string;
  brands: string[];
  requestSave: boolean;

  [key: string]: string | number | string[] | boolean | undefined;
}

export interface CampaignForm {
  campaign: FieldsForm;
  errors: Partial<CampaignFormError>;
}

const defaultCampaignState: CampaignForm = {
  campaign: {
    brands: [],
    country: '',
    global_budget: undefined,
    name: '',
    requestSave: false,
  } as FieldsForm,
  errors: {} as CampaignFormError,
};

enum types {
  CAMPAIGN_CLEAR = '[campaign form] CAMPAIGN_CLEAR',
  CAMPAIGN_CLEAR_ERROR = '[campaign form] CAMPAIGN_CLEAR_ERROR',
  CAMPAIGN_UPDATE = '[campaign form] CAMPAIGN_UPDATE',
  CAMPAIGN_UPDATE_ERROR = '[campaign form] CAMPAIGN_UPDATE_ERROR',
  CAMPAIGN_REQUEST_SAVE = '[campaign form] CAMPAIGN_REQUEST_SAVE',
  CAMPAIGN_REQUESTED_SAVE = '[campaign form] CAMPAIGN_REQUESTED_SAVE',
}

const clearCampaignAction = () => ({
  type: types.CAMPAIGN_CLEAR as typeof types.CAMPAIGN_CLEAR,
});

const clearCampaignErrorAction = () => ({
  type: types.CAMPAIGN_CLEAR_ERROR as typeof types.CAMPAIGN_CLEAR_ERROR,
});

const updateCampaignAction = (campaign: Partial<FieldsForm>) => ({
  payload: campaign,
  type: types.CAMPAIGN_UPDATE as typeof types.CAMPAIGN_UPDATE,
});

const updateCampaignErrorAction = (field: string, message: string) => ({
  payload: { [field]: message },
  type: types.CAMPAIGN_UPDATE_ERROR as typeof types.CAMPAIGN_UPDATE_ERROR,
});

const requestSaveCampaignAction = () => ({
  type: types.CAMPAIGN_REQUEST_SAVE as typeof types.CAMPAIGN_REQUEST_SAVE,
});

const requestedSaveCampaignAction = () => ({
  type: types.CAMPAIGN_REQUESTED_SAVE as typeof types.CAMPAIGN_REQUESTED_SAVE,
});

type ClearCampaignErrorAction = ReturnType<typeof clearCampaignErrorAction>;
type ClearCampaignAction = ReturnType<typeof clearCampaignAction>;
type UpdateCampaignErrorAction = ReturnType<typeof updateCampaignErrorAction>;
type UpdateCampaignAction = ReturnType<typeof updateCampaignAction>;
type RequestSaveCampaignAction = ReturnType<typeof requestSaveCampaignAction>;
type RequestedSaveCampaignAction = ReturnType<
  typeof requestedSaveCampaignAction
>;

type Actions =
  | UpdateCampaignErrorAction
  | ClearCampaignAction
  | ClearCampaignErrorAction
  | UpdateCampaignAction
  | RequestSaveCampaignAction
  | RequestedSaveCampaignAction;

const actions = {
  updateCampaignError: updateCampaignErrorAction,
  clearCampaignError: clearCampaignErrorAction,
  clearCampaign: clearCampaignAction,
  updateCampaign: updateCampaignAction,
  requestSaveCampaign: requestSaveCampaignAction,
  requestedSaveCampaign: requestedSaveCampaignAction,
};

function campaignForm(state: CampaignForm, action: Actions) {
  switch (action.type) {
    case types.CAMPAIGN_CLEAR:
      return defaultCampaignState;
    case types.CAMPAIGN_CLEAR_ERROR:
      return { ...state, errors: {} };
    case types.CAMPAIGN_UPDATE_ERROR:
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case types.CAMPAIGN_REQUEST_SAVE:
      return { ...state, campaign: { ...state.campaign, requestSave: true } };
    case types.CAMPAIGN_REQUESTED_SAVE:
      return { ...state, campaign: { ...state.campaign, requestSave: false } };
    case types.CAMPAIGN_UPDATE:
      return {
        ...state,
        campaign: {
          ...state.campaign,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

interface Props {
  refEl: React.RefObject<HTMLElement>;
  createOrUpdateCampaign?:
    | typeof actionsDemandCampaign.createCampaign
    | typeof actionsDemandCampaign.updateCampaign;
  validationType?: ValidationType;
}

type ValidationType = 'create' | 'update';

interface Dirty {
  brands: boolean;
  country: boolean;
  global_budget: boolean;
  name: boolean;

  [key: string]: boolean;
}

function useCampaignForm({
  createOrUpdateCampaign = useCreateCampaign(),
  validationType = 'create' as ValidationType,
  refEl,
}: Props) {
  const [state, dispatch] = React.useReducer(
    campaignForm,
    defaultCampaignState
  );
  const [formValidated, setFormValidated] = React.useState(false);
  const [campaignSchema] = React.useState(() => {
    if (validationType === 'create') {
      return Joi.object()
        .keys({
          brands: Joi.array()
            .items(Joi.string().required())
            .required()
            .error(() => {
              dispatch(
                actions.updateCampaignError(
                  'brands',
                  'At least one brand must be selected.'
                )
              );
              return 'brands error';
            }),
          country: Joi.string()
            .required()
            .error(() => {
              dispatch(
                actions.updateCampaignError(
                  'country',
                  'A country must be selected.'
                )
              );
              return 'country error';
            }),
          global_budget: Joi.number()
            .min(1000)
            .required()
            .error(() => {
              dispatch(
                actions.updateCampaignError(
                  'global_budget',
                  'Global budget is not greater than 1000.'
                )
              );
              return 'global_budget error';
            }),
          name: Joi.string()
            .min(10)
            .required()
            .error(() => {
              dispatch(
                actions.updateCampaignError(
                  'name',
                  'Name is not at least 10 caracteres long.'
                )
              );
              return 'name error';
            }),
        })
        .required();
    } else {
      return Joi.object()
        .keys({
          global_budget: Joi.number()
            .min(1000)
            .required()
            .error(() => {
              dispatch(
                actions.updateCampaignError(
                  'global_budget',
                  'Global budget is not greater than 1000.'
                )
              );
              return 'global_budget error';
            }),
          name: Joi.string()
            .min(10)
            .required()
            .error(() => {
              dispatch(
                actions.updateCampaignError(
                  'name',
                  'Name is not at least 10 caracteres long.'
                )
              );
              return 'name error';
            }),
        })
        .required();
    }
  });

  const [dirty, setDirty] = React.useState({
    name: false,
    global_budget: false,
    country: false,
    brands: false,
  } as Dirty);
  const campaign = state.campaign;
  const errors = state.errors || ({} as CampaignFormError);

  useEvent({
    eventType: 'demeter-input-change',
    onHandler: handlerCampaignChange,
    debounceFor: 300,
    refEl,
  });

  useEvent({
    onHandler: handlerCreateCampaign,
    refEl,
  });

  // Display validationPanel when on page edit campaign.
  //console.log('dirty', dirty, formValidated);

  React.useEffect(() => {
    const fields = _.keys(campaign);

    fields.forEach(field => {
      if (
        dirty[field] === false &&
        !_.isEqual(campaign[field], defaultCampaignState.campaign[field])
      ) {
        setDirty(state => ({
          ...state,
          [field]: true,
        }));
      }
    });
  }, [campaign]);

  React.useEffect(() => {
    dispatch(actions.clearCampaignError());
    Joi.validate(
      campaign,
      campaignSchema,
      { abortEarly: false, allowUnknown: true },
      (error: Joi.ValidationError, _value: FieldsForm) => {
        if (error) {
          setFormValidated(false);
          return error;
        }

        setFormValidated(true);
      }
    );
  }, [campaign]);

  React.useEffect(() => {
    if (formValidated && campaign && campaign.requestSave) {
      dispatch(actions.requestedSaveCampaign());
      const json = {
        brands: campaign.brands,
        country: campaign.country,
        global_budget: +campaign.global_budget!,
        name: campaign.name,
      };

      // @ts-ignore: Second arguments is passed using closure
      createOrUpdateCampaign(json);
    }
  }, [campaign]);

  function handlerCreateCampaign() {
    dispatch(actions.requestSaveCampaign());
  }

  function handlerCampaignChange(event: CustomEvent) {
    event.stopPropagation();

    update({
      [event.detail.identifier]: event.detail.value,
    });
  }

  function clear() {
    dispatch(actions.clearCampaign());
  }

  function update(newState: Partial<FieldsForm>) {
    dispatch(actions.updateCampaign(newState));
  }

  return {
    actions: {
      clear,
      update,
    },
    campaign: campaign || defaultCampaignState,
    errors: {
      name: dirty.name ? errors.name : '',
      country: dirty.country ? errors.country : '',
      global_budget: dirty.global_budget ? errors.global_budget : '',
      brands: dirty.brands ? errors.brands : '',
    },
    formValidated,
    handlerCreateCampaign,
  };
}

export default useCampaignForm;
