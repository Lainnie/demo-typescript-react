import { Epic, ofType } from 'redux-observable';
import { of, throwError } from 'rxjs';
import { catchError, map, mergeMap, retry, switchMap } from 'rxjs/operators';
import { ajax, CustomAjaxResponse } from '../shared/ajax';
import * as _ from 'lodash';

import * as logger from '../shared/logger';

import { getGateway } from '../shared/utils';

export { useLineItems, useGetAllLineItems } from './use';

export enum types {
  GET_LINE_ITEMS = '[supply-line-items] GET_LINE_ITEMS',
  GET_LINE_ITEMS_SUCCEED = '[supply-line-items] GET_LINE_ITEMS_SUCCEED',
  GET_LINE_ITEMS_FAILED = '[supply-line-items] GET_LINE_ITEMS_FAILED',
}

interface ServerError {
  status: number;
  message: string;
}

export interface SupplyLineItemsState {
  lineItems: any[];
}

const getLineItemsAction = () => ({
  type: types.GET_LINE_ITEMS as typeof types.GET_LINE_ITEMS,
});

const getLineItemsSucceedAction = (lineItems: any[]) => ({
  payload: lineItems,
  type: types.GET_LINE_ITEMS_SUCCEED as typeof types.GET_LINE_ITEMS_SUCCEED,
});

const getLineItemsFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_LINE_ITEMS_FAILED as typeof types.GET_LINE_ITEMS_FAILED,
});

type GetLineItemsAction = ReturnType<typeof getLineItemsAction>;
type GetLineItemsSucceedAction = ReturnType<typeof getLineItemsSucceedAction>;
type GetLineItemsFailedAction = ReturnType<typeof getLineItemsFailedAction>;

type Actions =
  | GetLineItemsAction
  | GetLineItemsSucceedAction
  | GetLineItemsFailedAction;

export const actions = {
  getLineItems: getLineItemsAction,
};

export const lineItemsDefaultState = {
  lineItems: [],
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── LINE ITEM RETAILERS - RANDOM DATA GENERATOR ────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────
const getProgression = () => {
  return Math.round(Math.random() * (99 - 0) + 0);
};

const getImpression = () => {
  return Math.round(Math.random() * (199999 - 10000) + 10000);
};

const getInteractions = () => {
  const result = Math.random() * (2.2 - 0.3) + 0.3;
  return result.toFixed(1);
};

const defaultBrandList = [
  {
    group: null,
    language: 'fr_FR',
    country: 'FR',
    name: 'SAMSUNG',
    meta_id: 'd3e5100d-cb9e-4a27-9cda-1756a6fd1707',
    group_id: null,
  },
  {
    group: {
      id: '5489c4b0-e298-4f0a-9619-80d5716286ca',
      name: 'Microsoft Corporation',
    },
    language: 'fr_FR',
    country: 'FR',
    name: 'Microsoft',
    meta_id: '10759fe2-db96-472c-af14-1ff625502cf5',
    group_id: '5489c4b0-e298-4f0a-9619-80d5716286ca',
  },
  {
    group: {
      id: '82963480-bec4-493b-aabb-2d4a8b39f4f7',
      name: 'Coca-Cola Company',
    },
    language: 'fr_FR',
    country: 'FR',
    name: 'SPRITE',
    meta_id: 'fb2cb896-9018-41bf-a3ac-9520f2050dc8',
    group_id: '82963480-bec4-493b-aabb-2d4a8b39f4f7',
  },
  {
    group: {
      id: '82963480-bec4-493b-aabb-2d4a8b39f4f7',
      name: 'Coca-Cola Company',
    },
    language: 'fr_FR',
    country: 'FR',
    name: 'FANTA',
    meta_id: '2bfea137-b090-4210-a07d-340e11ee8e3c',
    group_id: '82963480-bec4-493b-aabb-2d4a8b39f4f7',
  },
];
const enhanceWithRandomData = (lineItemRetailers: any[]) => {
  return lineItemRetailers.map(lineItemRetailer => ({
    ...lineItemRetailer,
    line_item: {
      ...lineItemRetailer.line_item,
      brands: defaultBrandList[_.random(0, 3)].name,
      imp: getImpression(),
      budget: _.random(1000, 10000, false),
      progress: getProgression(),
      interactions: getInteractions(),
    },
  }));
};

const lineItemsReducer = (
  state: SupplyLineItemsState = lineItemsDefaultState,
  action: Actions
) => {
  switch (action.type) {
    case types.GET_LINE_ITEMS_SUCCEED:
      return {
        ...state,
        // lineItems: action.payload,
        lineItems: enhanceWithRandomData(action.payload),
      };
    default:
      return state;
  }
};
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────

export const reducers = { lineItems: lineItemsReducer };

const getLineItem$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_LINE_ITEMS),
    switchMap((action: GetLineItemsAction) =>
      ajax({
        url: getGateway('/gateway/supply-line-items'),
        method: 'GET',
      }).pipe(
        map(attempt =>
          getLineItemsSucceedAction(attempt.response.line_items_retailers)
        ),
        catchError((err: any, caught: any) => {
          logger.error(err);
          return throwError({
            message: 'CROWN says No!',
            status: 500,
          });
        })
      )
    )
  );
export const epics = [getLineItem$];
