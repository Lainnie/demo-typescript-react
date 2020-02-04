import * as React from 'react';
import * as Joi from 'joi';
import * as _ from 'lodash';
import { MeccaSVC } from 'olympus-anesidora';
import { RetailerCartridgeState } from './utils';
import { getZoneTypesState, ZoneCheckboxState } from './line-item-zones/utils';
import {
  CustomRouteComponentProps, getCustomRouteComponentProps,
} from '../shared/routing';
import {
  ApiCampaign,
} from '../demand-campaigns/core';
import { useCurrentUser } from '../authent/use';
import { DropdownItemBaseProps } from '../shared/Dropdown';
import { TemplateCheckboxState } from './line-item-formats/utils';
import {
  useGetAllMProducts,
  useMProducts,
  useIsDemandWorkflowLineItemStoreRegistered,
} from './use';
import {
  epics as demandWorkflowLineItemEpics,
  reducers as demandWorkflowLineItemReducers,
} from './core';
import {
  epics as supplyEpics,
  reducers as supplyReducers,
  useRetailers,
} from '../supply/core';
import {
  epics as demandCampaignsEpics,
  reducers as demandCampaignsReducers,
} from '../demand-campaigns/core';
import {
  formats as formatsDuckling,
  zones as zonesDuckling,
  templates as templatesDuckling,
  lineItemBundle as lineItemBundleDuckling,
} from './ducklings';
import { useRegisterForStore } from '../shared/use';
import { useIsSupplyStoreRegistered } from '../supply/use';
import { useIsDemandCampaignsStoreRegistered } from '../demand-campaigns/use';

export interface CustomRouteSP {
  guaranteed: boolean;
}
export interface CustomRouteMP {
  campaign_id: string;
  line_item_id?: string;
}
export interface LineItemRouteProps
  extends CustomRouteComponentProps<CustomRouteSP,CustomRouteMP> {}

//
// ────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: L I N E - I T E M - F O R M   D U C K : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//


export enum LineItemFormField {
  NAME = 'name',
  BUDGET = 'budget',
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  RETAILERS = 'retailers',
  MPRODUCTS = 'mProducts',
  ZONETYPES = 'zoneTypes',
  TEMPLATES = 'templates',
};

export interface LineItemForm_fieldsState {
  [LineItemFormField.NAME]: string;
  [LineItemFormField.BUDGET]: string;
  [LineItemFormField.START_DATE]: Date;
  [LineItemFormField.END_DATE]: Date;
  [LineItemFormField.RETAILERS]: DropdownItemBaseProps<RetailerCartridgeState>[];
  [LineItemFormField.MPRODUCTS]: DropdownItemBaseProps<MeccaSVC.MProduct>[];
  [LineItemFormField.ZONETYPES]: ZoneCheckboxState[];
  [LineItemFormField.TEMPLATES]: TemplateCheckboxState[];
  [key: string]: any;
}

interface LineItemForm_dirty {
  [LineItemFormField.NAME]: boolean;
  [LineItemFormField.BUDGET]: boolean;
  [LineItemFormField.START_DATE]: boolean;
  [LineItemFormField.END_DATE]: boolean;
  [LineItemFormField.RETAILERS]: boolean;
  [LineItemFormField.MPRODUCTS]: boolean;
  [LineItemFormField.ZONETYPES]: boolean;
  [LineItemFormField.TEMPLATES]: boolean;
  // [key: string]: boolean | { [attr: string]: boolean };
}

interface LineItemForm_errors {
  [LineItemFormField.NAME]: string;
  [LineItemFormField.BUDGET]: string;
  [LineItemFormField.START_DATE]: string;
  [LineItemFormField.END_DATE]: string;
  [LineItemFormField.RETAILERS]: string;
  [LineItemFormField.MPRODUCTS]: string;
  [LineItemFormField.ZONETYPES]: string;
  [LineItemFormField.TEMPLATES]: string;
  // [fieldId: string]: string | { [attr: string]: string };
}

// State interface
export interface LineItemForm {
  formInitialized: boolean;
  formValidated: boolean;
  requestSave: boolean;
  campaign: ApiCampaign | null;
  fieldsState: LineItemForm_fieldsState;
  dirty: LineItemForm_dirty;
  errors: LineItemForm_errors;
}

// Action types
enum types {
  LI_UPDATE = '[lineItem form] LI_UPDATE',
  LI_UPDATE_FIELD_STATE = '[lineItem form] LI_UPDATE_FIELD_STATE',
  LI_UPDATE_DIRTY = '[lineItem form] LI_UPDATE_DIRTY',
  LI_UPDATE_ERRORS = '[lineItem form] LI_UPDATE_ERRORS',
  LI_CLEAR_ERRORS = '[lineItem form] LI_CLEAR_ERRORS',
}

// Action Creators
const liUpdate = (data: Partial<LineItemForm>) => ({
  type: types.LI_UPDATE as typeof types.LI_UPDATE,
  payload: data,
});
const liUpdateFieldState = (data: Partial<LineItemForm_fieldsState>) => ({
  type: types.LI_UPDATE_FIELD_STATE as typeof types.LI_UPDATE_FIELD_STATE,
  payload: data,
});
const liUpdateDirty = (data: Partial<LineItemForm_dirty>) => ({
  type: types.LI_UPDATE_DIRTY as typeof types.LI_UPDATE_DIRTY,
  payload: data,
});
const liUpdateErrors = (data: Partial<LineItemForm_errors>) => ({
  type: types.LI_UPDATE_ERRORS as typeof types.LI_UPDATE_ERRORS,
  payload: data,
});
const liClearErrors = () => ({
  type: types.LI_CLEAR_ERRORS as typeof types.LI_CLEAR_ERRORS,
  payload: null,
})


type LiUpdateAction = ReturnType<typeof liUpdate>;
type LiUpdateFieldState = ReturnType<typeof liUpdateFieldState>;
type LiUpdateDirty = ReturnType<typeof liUpdateDirty>;
type LiUpdateErrors = ReturnType<typeof liUpdateErrors>;
type LiClearErrors = ReturnType<typeof liClearErrors>;

export type LineItemFormActions =
  | LiUpdateAction
  | LiUpdateFieldState
  | LiUpdateDirty
  | LiUpdateErrors
  | LiClearErrors;

export const lineItemFormActions = {
  liUpdate,
  liUpdateFieldState,
  liUpdateDirty,
  liUpdateErrors,
  liClearErrors,
};


export const defaultLineItemFormState: LineItemForm = {
  formInitialized: false,
  formValidated: false,
  requestSave: false,
  campaign: null,
  fieldsState: {
    name: '',
    budget: '',
    start_date: new Date(),
    end_date: new Date(),
    retailers: [],
    mProducts: [],
    zoneTypes: getZoneTypesState(),
    templates: [],
  },
  dirty: {
    name: false,
    budget: false,
    start_date: false,
    end_date: false,
    retailers: false,
    mProducts: false,
    zoneTypes: false,
    templates: false,
  },
  errors: {
    name: '',
    budget: '',
    start_date: '',
    end_date: '',
    retailers: '',
    mProducts: '',
    zoneTypes: '',
    templates: '',
  },
};

export const lineItemForm: React.Reducer<LineItemForm, LineItemFormActions> = (
  state: LineItemForm,
  action: LineItemFormActions
) => {
  switch (action.type) {
    case types.LI_UPDATE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case types.LI_UPDATE_FIELD_STATE: {
      return {
        ...state,
        fieldsState: {
          ...state.fieldsState,
          ...action.payload,
        },
      };
    }
    case types.LI_UPDATE_DIRTY: {
      return {
        ...state,
        dirty: {
          ...state.dirty,
          ...action.payload,
        },
      };
    }
    case types.LI_UPDATE_ERRORS: {
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    }
    case types.LI_CLEAR_ERRORS: {
      return {
        ...state,
        errors: {...defaultLineItemFormState.errors},
      };
    }
    default: {
      return state;
    }
  }
};

//
// ────────────────────────────────────────────────────────────────────────── III ──────────
//   :::::: L I N E - I T E M   C O N T E X T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

export interface LineItemContextProps extends LineItemForm {}

export const LineItemContext = React.createContext<LineItemContextProps>(
  {} as LineItemContextProps
);


export interface LineItemSectionProps {
  previousFormInitialized: boolean,
  updateFieldState: (newState: Partial<LineItemForm_fieldsState>) => void
}


//
// ────────────────────────────────────────────────────── V ──────────
//   :::::: E F F E C T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

export const useLineItemFormUpdateOnCampaignRetrieval = (campaign: ApiCampaign|undefined, dispatch: React.Dispatch<LineItemFormActions>) => {
  React.useEffect(() => {
    if (campaign) {
      dispatch(lineItemFormActions.liUpdate({ campaign }));
    }
  }, [campaign]);
}


//
// ─── 2. USE LINE ITEM FORM VALIDATION ──────────────────────────────────────────────
//

interface ValidateFormStateInput {
  lineItemState: LineItemForm;
  dispatch: React.Dispatch<LineItemFormActions>;
}

const validateFormState = ({
  lineItemState,
  dispatch,
}: ValidateFormStateInput) => {
  dispatch(lineItemFormActions.liClearErrors());
  const lineItemFormSchema = getLineItemFormSchema({ currentLineItemState: lineItemState, dispatch });
  Joi.validate(
    lineItemState.fieldsState,
    lineItemFormSchema,
    { abortEarly: false, allowUnknown: true },
    (error: Joi.ValidationError, _value: LineItemForm_fieldsState) => {
      if (error) {
        dispatch(lineItemFormActions.liUpdate({ formValidated: false }));
        return error;
      }
      dispatch(lineItemFormActions.liUpdate({ formValidated: true }));
    }
  );
};


const atLeastOneDirtyField = (lineItemState: LineItemForm) => {
  return Object.values(lineItemState.dirty).some((fieldDirtyVal:boolean) => fieldDirtyVal);
}

interface FieldErrorHandlerInput extends UseLineItemFormValidationInput {
  fieldName: LineItemFormField;
  errorMessage: string,
  errorCode: string,
}
const fieldErrorHandler = ({
  fieldName,
  currentLineItemState,
  dispatch,
  errorMessage,
  errorCode,
}: FieldErrorHandlerInput) => {
  return () => {
    // Only if field is dirty, validate field
    if (currentLineItemState.dirty[fieldName]) {
      dispatch(
        lineItemFormActions.liUpdateErrors({
          [fieldName]: errorMessage,
        })
      );
      return errorCode;
    }
    return '';
  }
}

interface GetLineItemFormSchemaInput extends UseLineItemFormValidationInput {};
const getLineItemFormSchema = ({ currentLineItemState, dispatch }: GetLineItemFormSchemaInput) => {
  return Joi.object()
    .keys({
      // General section
      budget: Joi.number()
        .min(100)
        .required()
        .error(fieldErrorHandler({
          fieldName: LineItemFormField.BUDGET,
          errorMessage: 'Budget is not greater than 100.',
          errorCode: 'budget error',
          currentLineItemState,
          dispatch,
        })),
      name: Joi.string()
        .min(10)
        .required()
        .error(fieldErrorHandler({
          fieldName: LineItemFormField.NAME,
          errorMessage: 'Name is not at least 10 caracteres long.',
          errorCode: 'name error',
          currentLineItemState,
          dispatch,
        })),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      // Retailer section
      retailers: Joi.array()
        .min(1)
        .required(),
      mProducts: Joi.array()
        .min(1)
        .required(),
      zoneTypes: Joi.array()
        .length(5)
        .items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            retailers: Joi.array(),
            zones: Joi.array(),
            checked: Joi.boolean().valid(true),
          }).required(),
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            retailers: Joi.array(),
            zones: Joi.array(),
            checked: Joi.boolean(),
          }).optional()
        )
        .required(),
      templates: Joi.array()
        .items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            formats: Joi.array(),
            creative: Joi.any(),
            checked: Joi.boolean().valid(true),
          }).required(),
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            formats: Joi.array(),
            creative: Joi.any(),
            checked: Joi.boolean(),
          }).optional()
        )
        .required(),
    })
    .required();
}

interface UseLineItemFormValidationInput {
  dispatch: React.Dispatch<LineItemFormActions>;
  currentLineItemState: LineItemForm;
}

export const useLineItemFormValidation = ({
  dispatch,
  currentLineItemState,
}: UseLineItemFormValidationInput) => {
    React.useEffect(
    _.debounce(() => {
      if (currentLineItemState.formInitialized && atLeastOneDirtyField(currentLineItemState)) {
        validateFormState({
          lineItemState: currentLineItemState,
          dispatch,
        });
      }
    }, 500),
    [currentLineItemState.fieldsState]
  );
}

//
// ─── USE-ON-SAVE-REQUEST ────────────────────────────────────────────────────────
//

interface UseOnSaveRequestInput {
  lineItemState: LineItemForm;
  dispatch: React.Dispatch<LineItemFormActions>;
  callback: () => void;
}
export const useOnSavingRequest = ({
  lineItemState,
  dispatch,
  callback,
}: UseOnSaveRequestInput) => {
  React.useEffect(() => {
    if (lineItemState.formValidated && lineItemState.requestSave) {
      dispatch(lineItemFormActions.liUpdate({ requestSave: false }));
      callback();
    }
  }, [lineItemState.requestSave]);
};


//
// ─── USE-M-PRODUCTS-FETCH-ON-CANPAIGN-RETRIEVAL ─────────────────────────────────
//

export const useMProductsFetchOnCampaignRetrieval = (campaign: ApiCampaign|undefined, areRequiredStoresRegistered: boolean) => {
  const mProductsState = useMProducts();
  const getAllMProducts = useGetAllMProducts();

  React.useEffect(() => {
    if (
      areRequiredStoresRegistered
      && campaign
      && campaign.brands.length
    ) {
      getAllMProducts(campaign.brands[0]);
    }
  }, [areRequiredStoresRegistered, campaign]);

  return mProductsState;
}


export const useAreLineItemBundleDepsReady = () => {
  const [areReady, setAreReady] = React.useState(false);

  const lineItemBundleState = lineItemBundleDuckling.useLineItemBundle();
  const retailers = useRetailers();
  const mProductsState = useMProducts();
  const zonesState = zonesDuckling.useZones();
  const formatsState = formatsDuckling.useFormats();

  React.useEffect(() => {
    if (
      !areReady
      && !lineItemBundleState.requestInProgress && lineItemBundleState.datum
      && !mProductsState.requestInProgress && mProductsState.data.length
      && !zonesState.requestInProgress && zonesState.data.length
      && retailers.length
      && !formatsState.requestInProgress && formatsState.data.length
    ) {
      setAreReady(true);
    }
  }, [
    lineItemBundleState,
    retailers,
    mProductsState,
    zonesState,
    formatsState,
  ]);

  return {
    lineItemBundleState,
    retailers,
    mProductsState,
    zonesState,
    formatsState,
    areLineItemBundleDepsReady: areReady,
  };
}


//
// ─── PROVIDER ───────────────────────────────────────────────────────────────────
//

const lineItemProviderActions = {
  update(
    dispatch: React.Dispatch<LineItemFormActions>,
    newState: Partial<LineItemForm>
  ) {
    dispatch(lineItemFormActions.liUpdate(newState));
  },
  handlerSavingRequest(dispatch: React.Dispatch<LineItemFormActions>) {
    dispatch(lineItemFormActions.liUpdate({ requestSave: true }));
  },
  handlerSavingRequestReset(dispatch: React.Dispatch<LineItemFormActions>) {
    dispatch(lineItemFormActions.liUpdate({ requestSave: false }));
  },
};

const getRenderProps = ({ dispatch, props, currentUser }: {
 dispatch: React.Dispatch<LineItemFormActions>,
 props: LineItemProviderProps2,
 currentUser: any
}) => {
 return {
   dispatch: dispatch,
   currentUser: currentUser,
   update: React.useCallback((newState: Partial<LineItemForm>) => {
     lineItemProviderActions.update(dispatch, newState);
   }, [dispatch]),
   requestSaving: React.useCallback(() => {
     lineItemProviderActions.handlerSavingRequest(dispatch);
   }, [dispatch]),
   requestSavingReset: React.useCallback(() => {
     lineItemProviderActions.handlerSavingRequest(dispatch);
   }, [dispatch]),
   ...getCustomRouteComponentProps<LineItemProviderProps2,CustomRouteSP, CustomRouteMP>(props),
 };
};
export type GetRenderPropsOutput = ReturnType<typeof getRenderProps>;



interface LineItemProviderProps2 extends LineItemRouteProps {
  render: (input: GetRenderPropsOutput) => React.ReactNode;
}


export function LineItemProvider2(props: LineItemProviderProps2) {
  const [lineItemState, dispatch] = React.useReducer(
    lineItemForm,
    defaultLineItemFormState
  );
  const currentUser = useCurrentUser();

  return (
    <LineItemContext.Provider value={lineItemState}>
      {props.render(getRenderProps({ dispatch, props, currentUser }))}
    </LineItemContext.Provider>
  );
}


//
// ─── REGISTER-REQUIRED-STORES ───────────────────────────────────────────────────
//

interface StoreDatum {
  identifier: string,
  epics: any[],
  reducers: any,
}
export function registerRequiredStores(mode: 'new'|'edit') {
  let storesData: StoreDatum[] = [
    {
      identifier: 'supply',
      epics: supplyEpics,
      reducers: supplyReducers,
    },
    {
      identifier: 'demandWorkflowLineItem',
      epics: demandWorkflowLineItemEpics,
      reducers: demandWorkflowLineItemReducers,
    },
    {
      identifier: 'demandCampaigns',
      epics: demandCampaignsEpics,
      reducers: demandCampaignsReducers,
    },
    {
      identifier: zonesDuckling.featureName,
      epics: zonesDuckling.epics,
      reducers: zonesDuckling.reducers,
    },
    {
      identifier: formatsDuckling.featureName,
      epics: formatsDuckling.epics,
      reducers: formatsDuckling.reducers,
    },
    {
      identifier: templatesDuckling.featureName,
      epics: templatesDuckling.epics,
      reducers: templatesDuckling.reducers,
    },
  ];

  if (mode === 'edit') {
    storesData.push({
      identifier: lineItemBundleDuckling.featureName,
      epics: lineItemBundleDuckling.epics,
      reducers: lineItemBundleDuckling.reducers,
    });
  }

  for (const storeDatum of storesData) {
    useRegisterForStore(storeDatum);
  }
}

export function useAreRequiredStoresRegistered(mode: 'new'|'edit') {
  const [areRegistered, setAreRegistered] = React.useState(false);

  const isSupplyStoreRegistered = useIsSupplyStoreRegistered();
  const isDemandWorkflowLineItemStoreRegistered = useIsDemandWorkflowLineItemStoreRegistered();
  const isDemandCampaignsStoreRegistered = useIsDemandCampaignsStoreRegistered();
  const isZonesDuckStoreRegistered = zonesDuckling.useIsZonesDuckStoreRegistered();
  const isFormatsDuckStoreRegistered = formatsDuckling.useIsFormatsDuckStoreRegistered();
  const isTemplatesDuckStoreRegistered = templatesDuckling.useIsTemplatesDuckStoreRegistered();
  let isLineItemBundleDuckStoreRegistered = true;

  if (mode === 'edit') {
    isLineItemBundleDuckStoreRegistered = lineItemBundleDuckling.useIsLineItemBundleDuckStoreRegistered()
  }

  React.useEffect(() => {
    if (
      !areRegistered
      && isSupplyStoreRegistered
      && isDemandWorkflowLineItemStoreRegistered
      && isDemandCampaignsStoreRegistered
      && isZonesDuckStoreRegistered
      && isFormatsDuckStoreRegistered
      && isTemplatesDuckStoreRegistered
      && isLineItemBundleDuckStoreRegistered
    ) {
      setAreRegistered(true);
    }
  }, [
    isSupplyStoreRegistered,
    isDemandWorkflowLineItemStoreRegistered,
    isDemandCampaignsStoreRegistered,
    isZonesDuckStoreRegistered,
    isFormatsDuckStoreRegistered,
    isTemplatesDuckStoreRegistered,
    isLineItemBundleDuckStoreRegistered,
  ]);

  return areRegistered;
};

export const useResetRequiredStores = () => {
  const resetFormatsDuckStore = formatsDuckling.useResetFormatsDuckStore();
  const resetZonesDuckStore = zonesDuckling.useResetZonesDuckStore();
  const resetTemplatesDuckStore = templatesDuckling.useResetTemplatesDuckStore();
  const resetLineItemBundleDuckStore = lineItemBundleDuckling.useResetLineItemBundleDuckStore();

  return React.useCallback(() => {
    resetFormatsDuckStore();
    resetZonesDuckStore();
    resetTemplatesDuckStore();
    resetLineItemBundleDuckStore();
  }, [
    resetFormatsDuckStore,
    resetZonesDuckStore,
    resetTemplatesDuckStore,
    resetLineItemBundleDuckStore,
  ])
};