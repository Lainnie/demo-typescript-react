import * as _ from 'lodash';
import { Epic, ofType } from 'redux-observable';
import { of, throwError } from 'rxjs';
import { ajax, CustomAjaxResponse } from '../shared/ajax';
import {
  catchError,
  debounceTime,
  map,
  retry,
  switchMap,
} from 'rxjs/operators';

import * as logger from '../shared/logger';

import { getGateway } from '../shared/utils';
import { Reducer } from 'redux';
import { CrownSVC } from 'olympus-anesidora';
import { LineItemBundleJson } from 'demand-workflow-line-items/utils';

export {
  useLastCreatedCampaign,
  useGetLineItem,
  useLineItem,
  useCampaign,
  useCampaigns,
  useCampaignRequest,
  useCampaignRequestInProgress,
  useCreateCampaign,
  useGetAllCampaigns,
  useUpdateCampaign,
  useLineItems,
  useGetAllLineItems,
  useCreateLineItemBundle,
  useLastCreatedLineItemBundle,
  useRequestResetOnUnmount,
} from './use';

export enum types {
  GET_CAMPAIGNS = '[demand-campaigns] GET_CAMPAIGNS',
  GET_LINEITEMS = '[demand-campaigns] GET_LINEITEMS',
  GET_LINEITEMS_SUCCEED = '[demand-campaigns] GET_LINEITEMS_SUCCEED',
  GET_LINEITEMS_FAILED = '[demand-campaigns] GET_LINEITEMS_FAILED',
  GET_CAMPAIGNS_SUCCEED = '[demand-campaigns] GET_CAMPAIGNS_SUCCEED',
  GET_CAMPAIGNS_FAILED = '[demand-campaigns] GET_CAMPAIGNS_FAILED',
  CREATE_CAMPAIGN = '[demand-campaigns] CREATE_CAMPAIGN',
  UPDATE_CAMPAIGN = '[demand-campaigns] UPDATE_CAMPAIGN',
  CREATE_CAMPAIGN_SUCCEED = '[demand-campaigns] CREATE_CAMPAIGN_SUCCEED',
  CREATE_CAMPAIGN_FAILED = '[demand-campaigns] CREATE_CAMPAIGN_FAILED',

  CREATE_LINEITEM_BUNDLE = '[demand-campaigns] CREATE_LINEITEM_BUNDLE',
  CREATE_LINEITEM_BUNDLE_SUCCEED = '[demand-campaigns] CREATE_LINEITEM_BUNDLE_SUCCEED',
  CREATE_LINEITEM_BUNDLE_FAILED = '[demand-campaigns] CREATE_LINEITEM_BUNDLE_FAILED',
  UPDATE_LINEITEM = '[demand-campaigns] UPDATE_LINEITEM',

  GET_LINEITEM = '[demand-campaigns] GET_LINEITEM',
  GET_LINEITEM_SUCCEED = '[demand-campaigns] GET_LINEITEM_SUCCEED',
  GET_LINEITEM_FAILED = '[demand-campaigns] GET_LINEITEM_FAILED',

  RESET_REQUEST = '[demand-campaigns] RESET_REQUEST',
}

export interface ApiCampaign {
  id: string;
  name: string;
  global_budget: number;
  country: string;
  brands: string[];
  account_id?: string;
}

export interface LineItemBundle {
  lineItem: CrownSVC.LineItem;
  lineItemRetailers: CrownSVC.LineItemRetailer[];
  creatives: CrownSVC.Creative[];
}

export interface DemandCampaignsState {
  lastCreatedCampaign: null | ApiCampaign;
  campaigns: ApiCampaign[];
  lastCreatedLineItem: null | LineItemBundle;
  lineItems: CrownSVC.LineItem[];
  requestInProgress: boolean;
  request: string;
}

interface ServerError {
  status: number;
  message: string;
}

const getCampaignsAction = (id?: string) => ({
  payload: id,
  type: types.GET_CAMPAIGNS as typeof types.GET_CAMPAIGNS,
});

const getLineItemsAction = (campaign_id: string) => ({
  payload: campaign_id,
  type: types.GET_LINEITEMS as typeof types.GET_LINEITEMS,
});

const getLineItemsSucceedAction = (lineItems: CrownSVC.LineItem[]) => ({
  payload: lineItems,
  type: types.GET_LINEITEMS_SUCCEED as typeof types.GET_LINEITEMS_SUCCEED,
});

const getLineItemsFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_LINEITEMS_FAILED as typeof types.GET_LINEITEMS_FAILED,
});

const getCampaignsSucceedAction = (campaigns: ApiCampaign[]) => ({
  payload: campaigns,
  type: types.GET_CAMPAIGNS_SUCCEED as typeof types.GET_CAMPAIGNS_SUCCEED,
});

const getCampaignsFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_CAMPAIGNS_FAILED as typeof types.GET_CAMPAIGNS_FAILED,
});

const createCampaignAction = (campaign: Partial<ApiCampaign>) => ({
  payload: campaign,
  type: types.CREATE_CAMPAIGN as typeof types.CREATE_CAMPAIGN,
});

const updateCampaignAction = (campaign: Partial<ApiCampaign>, id: string) => ({
  payload: {
    ...campaign,
    id,
  },
  type: types.UPDATE_CAMPAIGN as typeof types.UPDATE_CAMPAIGN,
});

const createCampaignSucceedAction = ({
  campaign,
}: {
  campaign: ApiCampaign;
}) => ({
  payload: campaign,
  type: types.CREATE_CAMPAIGN_SUCCEED as typeof types.CREATE_CAMPAIGN_SUCCEED,
});

const createCampaignFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.CREATE_CAMPAIGN_FAILED as typeof types.CREATE_CAMPAIGN_FAILED,
});

const updateLineItemAction = (lineItem: CrownSVC.LineItem, id: string) => ({
  payload: {
    ...lineItem,
    id,
  },
  type: types.UPDATE_LINEITEM as typeof types.UPDATE_LINEITEM,
});

// LINEITEM CREATE
const createLineItemBundleAction = (
  campaignId: string,
  bundle: LineItemBundleJson
) => ({
  payload: { campaignId, bundle },
  type: types.CREATE_LINEITEM_BUNDLE as typeof types.CREATE_LINEITEM_BUNDLE,
});

const createLineItemBundleSucceedAction = (bundle: LineItemBundle) => ({
  payload: bundle,
  type: types.CREATE_LINEITEM_BUNDLE_SUCCEED as typeof types.CREATE_LINEITEM_BUNDLE_SUCCEED,
});

const createLineItemBundleFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.CREATE_LINEITEM_BUNDLE_FAILED as typeof types.CREATE_LINEITEM_BUNDLE_FAILED,
});

// LINEITEM GET
const getLineItemAction = (id: string) => ({
  type: types.GET_LINEITEM as typeof types.GET_LINEITEM,
  payload: { id },
});
const getLineItemSucceedAction = ({
  lineItem,
}: {
  lineItem: CrownSVC.LineItem;
}) => ({
  payload: lineItem,
  type: types.GET_LINEITEM_SUCCEED as typeof types.GET_LINEITEM_SUCCEED,
});

const getLineItemFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_LINEITEM_FAILED as typeof types.GET_LINEITEM_FAILED,
});

const resetRequestAction = () => ({
  type: types.RESET_REQUEST as typeof types.RESET_REQUEST,
});

type GetLineItemsAction = ReturnType<typeof getLineItemsAction>;
type GetCampaignAction = ReturnType<typeof getCampaignsAction>;
type GetCampaignSucceedAction = ReturnType<typeof getCampaignsSucceedAction>;
type GetCampaignFailedAction = ReturnType<typeof getCampaignsFailedAction>;
type GetLineItemsSucceedAction = ReturnType<typeof getLineItemsSucceedAction>;
type GetLineItemsFailedAction = ReturnType<typeof getLineItemsFailedAction>;
type CreateCampaignAction = ReturnType<typeof createCampaignAction>;
type UpdateCampaignAction = ReturnType<typeof updateCampaignAction>;
type CreateCampaignSucceedAction = ReturnType<
  typeof createCampaignSucceedAction
>;

type UpdateLineItemAction = ReturnType<typeof updateLineItemAction>;

type CreateCampaignFailedAction = ReturnType<typeof createCampaignFailedAction>;

type CreateLineItemBundleAction = ReturnType<typeof createLineItemBundleAction>;
type CreateLineItemBundleSucceedAction = ReturnType<
  typeof createLineItemBundleSucceedAction
>;
type CreateLineItemBundleFailedAction = ReturnType<
  typeof createLineItemBundleFailedAction
>;

type GetLineItemAction = ReturnType<typeof getLineItemAction>;
type GetLineItemSucceedAction = ReturnType<typeof getLineItemSucceedAction>;
type GetLineItemFailedAction = ReturnType<typeof getLineItemFailedAction>;

type ResetRequestAction = ReturnType<typeof resetRequestAction>;

type Actions =
  | GetLineItemsAction
  | GetCampaignAction
  | GetCampaignSucceedAction
  | GetCampaignFailedAction
  | GetLineItemsSucceedAction
  | GetLineItemsFailedAction
  | CreateCampaignAction
  | UpdateCampaignAction
  | CreateCampaignSucceedAction
  | CreateCampaignFailedAction
  | CreateLineItemBundleAction
  | CreateLineItemBundleSucceedAction
  | CreateLineItemBundleFailedAction
  | UpdateLineItemAction
  | GetLineItemAction
  | GetLineItemSucceedAction
  | GetLineItemFailedAction
  | ResetRequestAction;

export const actions = {
  createLineItemBundle: createLineItemBundleAction,
  createCampaign: createCampaignAction,
  updateCampaign: updateCampaignAction,
  getAllCampaigns: getCampaignsAction,
  getAllLineItems: getLineItemsAction,
  getLineItem: getLineItemAction,
  resetRequest: resetRequestAction,
};

export const campaignsDefaultState: DemandCampaignsState = {
  lastCreatedCampaign: null,
  campaigns: [],
  lastCreatedLineItem: null,
  lineItems: [],
  requestInProgress: false,
  request: '',
};

const campaignsReducer: Reducer<DemandCampaignsState, Actions> = (
  state = campaignsDefaultState,
  action
) => {
  switch (action.type) {
    case types.GET_LINEITEM_SUCCEED: {
      return {
        ...state,
        lineItems: [...state.lineItems, action.payload],
      };
    }
    case types.GET_LINEITEMS_SUCCEED:
      return { ...state, lineItems: action.payload };
    case types.GET_CAMPAIGNS_SUCCEED:
      return { ...state, campaigns: action.payload };
    case types.CREATE_CAMPAIGN_SUCCEED: {
      return {
        ...state,
        lastCreatedCampaign: action.payload,
        request: 'succeed',
        requestInProgress: false,
      };
    }
    case types.CREATE_LINEITEM_BUNDLE_SUCCEED: {
      return {
        ...state,
        lastCreatedLineItem: action.payload,
        request: 'succeed',
        requestInProgress: false,
      };
    }
    case types.CREATE_LINEITEM_BUNDLE_FAILED: {
      return {
        ...state,
        lastCreatedLineItem: null,
        request: 'failed',
        requestInProgress: false,
      };
    }
    case types.CREATE_CAMPAIGN_FAILED:
      return { ...state, request: 'failed', requestInProgress: false };
    case types.CREATE_LINEITEM_BUNDLE:
    case types.UPDATE_CAMPAIGN:
    case types.CREATE_CAMPAIGN:
      return { ...state, request: '', requestInProgress: true };
    case types.RESET_REQUEST: {
      return {
        ...state,
        request: '',
      };
    }
    default:
      return state;
  }
};

export const reducers = { campaigns: campaignsReducer };

const getCampaign$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_CAMPAIGNS),
    switchMap((action: GetCampaignAction) => {
      const path = action.payload ? `/${action.payload}` : '';

      return ajax({
        url: getGateway(`/gateway/demand-campaigns${path}`),
        method: 'GET',
      }).pipe(
        map(attempt => {
          if (_.isArray(attempt.response.campaigns)) {
            return getCampaignsSucceedAction(attempt.response.campaigns);
          } else {
            return getCampaignsSucceedAction([attempt.response.campaign]);
          }
        }),
        catchError((err: any, caught: any) => {
          logger.error(err);
          return throwError({
            message: 'Behemoth says No!',
            status: 500,
          });
        })
      );
    })
  );

const updateCampaign$: Epic = action$ =>
  action$.pipe(
    ofType(types.UPDATE_CAMPAIGN),
    debounceTime(1000),
    switchMap((action: UpdateCampaignAction) => {
      const path = `/${action.payload.id}`;

      return ajax({
        url: getGateway(`/gateway/demand-campaigns${path}`),
        method: 'PATCH',
        body: {
          ...action.payload,
        },
      }).pipe(
        map(attempt => createCampaignSucceedAction(attempt.response)),
        catchError((err, caught) => of(createCampaignFailedAction(err)))
      );
    })
  );

const createCampaign$: Epic = action$ =>
  action$.pipe(
    ofType(types.CREATE_CAMPAIGN),
    debounceTime(1000),
    switchMap((action: CreateCampaignAction) =>
      ajax({
        url: getGateway('/gateway/demand-campaigns'),
        method: 'POST',
        body: {
          ...action.payload,
        },
      }).pipe(
        map(attempt => createCampaignSucceedAction(attempt.response)),
        catchError((err, caught) => of(createCampaignFailedAction(err)))
      )
    )
  );

const getLineItem$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_LINEITEM),
    switchMap((action: GetLineItemAction) => {
      return ajax({
        url: getGateway(
          `/gateway/demand-line-items/line-items/${action.payload.id}`
        ),
        method: 'GET',
      }).pipe(
        map(attempt =>
          getLineItemSucceedAction({ lineItem: attempt.response.line_item })
        ),
        catchError((err: any, caught: any) => {
          logger.error(err);
          return throwError({
            message: 'Behemoth says No!',
            status: 500,
          });
        })
      );
    })
  );

const getLineItems$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_LINEITEMS),
    switchMap((action: GetLineItemsAction) => {
      const path = `/${action.payload}`;

      return ajax({
        url: getGateway(`/gateway/demand-line-items${path}`),
        method: 'GET',
      }).pipe(
        map(attempt => getLineItemsSucceedAction(attempt.response.line_items)),
        catchError((err: any, caught: any) => {
          logger.error(err);
          return throwError({
            message: 'Behemoth says No!',
            status: 500,
          });
        })
      );
    })
  );

const createLineItem$: Epic = action$ =>
  action$.pipe(
    ofType(types.CREATE_LINEITEM_BUNDLE),
    debounceTime(1000),
    switchMap((action: CreateLineItemBundleAction) => {
      const path = `/${action.payload.campaignId}/line-items`;

      return ajax({
        url: getGateway(`/gateway/demand-line-items${path}`),
        method: 'POST',
        body: action.payload.bundle,
      }).pipe(
        map((attempt: CustomAjaxResponse<LineItemBundle>) =>
          createLineItemBundleSucceedAction(attempt.response)
        ),
        catchError((err, caught) => of(createLineItemBundleFailedAction(err)))
      );
    })
  );

export const epics = [
  getCampaign$,
  createCampaign$,
  createLineItem$,
  updateCampaign$,
  getLineItem$,
  getLineItems$,
];
