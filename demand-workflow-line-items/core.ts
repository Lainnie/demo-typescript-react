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
import { MeccaSVC } from 'olympus-anesidora';
import { Reducer } from 'redux';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── ACTION TYPES ───────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

enum ActionTypes {
  GET_MPRODUCTS = '[demand-workflow-line-items] GET_MPRODUCTS',
  GET_MPRODUCTS_SUCCEEDED = '[demand-workflow-line-items] GET_MPRODUCTS_SUCCEEDED',
  GET_MPRODUCTS_FAILED = '[demand-workflow-line-items] GET_MPRODUCTS_FAILED',
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── REDUCER STATE ──────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export interface MProductsReducerState {
  data: MeccaSVC.MProduct[];
  error: Error | null;
  requestInProgress: boolean;
}

export const mProductsDefaultState: MProductsReducerState = {
  data: [],
  error: null,
  requestInProgress: false,
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── ACTION CREATORS ────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export const actionCreators = {
  getMProducts(brandId: string = '') {
    return {
      type: ActionTypes.GET_MPRODUCTS as typeof ActionTypes.GET_MPRODUCTS,
      payload: { brandId },
    };
  },
  getMProductsSucceeded(data: MeccaSVC.MProduct[]) {
    return {
      type: ActionTypes.GET_MPRODUCTS_SUCCEEDED as typeof ActionTypes.GET_MPRODUCTS_SUCCEEDED,
      payload: { mProducts: data },
    };
  },
  getMProductsFailed(error: Error) {
    return {
      type: ActionTypes.GET_MPRODUCTS_FAILED as typeof ActionTypes.GET_MPRODUCTS_FAILED,
      payload: { error },
    };
  },
};

type GetMProductsAction = ReturnType<typeof actionCreators.getMProducts>;
type GetMProductsSucceededAction = ReturnType<
  typeof actionCreators.getMProductsSucceeded
>;
type GetMProductsFailedAction = ReturnType<
  typeof actionCreators.getMProductsFailed
>;

type GetMProductsReducerActions =
  | GetMProductsAction
  | GetMProductsSucceededAction
  | GetMProductsFailedAction;

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── REDUCER ────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const getMProductsReducer: Reducer<
  MProductsReducerState,
  GetMProductsReducerActions
> = (state = mProductsDefaultState, action) => {
  switch (action.type) {
    case ActionTypes.GET_MPRODUCTS: {
      return {
        ...state,
        data: [],
        requestInProgress: true,
      };
    }
    case ActionTypes.GET_MPRODUCTS_SUCCEEDED: {
      return {
        ...state,
        data: action.payload.mProducts,
        requestInProgress: false,
      };
    }
    case ActionTypes.GET_MPRODUCTS_FAILED: {
      return {
        ...state,
        error: action.payload.error,
        requestInProgress: false,
      };
    }
    default: {
      return state;
    }
  }
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── EPICS ──────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const getMProductsEpic: Epic<GetMProductsAction, any, any, any> = action$ => {
  return action$.pipe(
    ofType(ActionTypes.GET_MPRODUCTS),
    switchMap(action =>
      ajax({
        url: getGateway(
          `/gateway/demand-line-items/mProducts/${action.payload.brandId}`
        ),
        method: 'GET',
      }).pipe(
        map(attempt => actionCreators.getMProductsSucceeded(attempt.response)),
        catchError((err, caught) => of(actionCreators.getMProductsFailed(err)))
      )
    )
  );
};

const getMProductsEpics = [getMProductsEpic];

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── COMMON ─────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export interface DemandWorkflowLineItemStorePortion {
  demandWorkflowLineItem: MProductsReducerState;
}

export const reducers = {
  mProducts: getMProductsReducer,
};

export const epics = [...getMProductsEpics];
