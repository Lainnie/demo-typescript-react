import { Reducer } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { DmdAdministration } from 'olympus-anesidora';
import { ajax, CustomAjaxResponse } from '../shared/ajax';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AthenaStore } from '../shared/store';

import { getGateway } from '../shared/utils';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── BRAND PRODUCTS GROUPED-BY SHELVES ──────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

enum BrandProductsGroupedByShelvesReducerActionTypes {
  GET = 'demandAdministration/brandProductsGroupedByShelves/GET',
  GET_SUCCEEDED = 'demandAdministration/brandProductsGroupedByShelves/GET_SUCCEEDED',
  GET_FAILED = 'demandAdministration/brandProductsGroupedByShelves/GET_FAILED',
}

export interface BrandProductsGroupedByShelvesReducerState {
  data: { shelves: DmdAdministration.MProductsByShelvesTree } | null;
  error: Error | null;
  requestInProgress: boolean;
}

export const brandProductsGroupedByShelvesReducerDefaultState: BrandProductsGroupedByShelvesReducerState = {
  data: null,
  error: null,
  requestInProgress: false,
};

export const brandProductsGroupedByShelvesReducerActions = {
  getBrandProductsGroupedByShelves(brandId: string) {
    return {
      payload: { brandId },
      type: BrandProductsGroupedByShelvesReducerActionTypes.GET as typeof BrandProductsGroupedByShelvesReducerActionTypes.GET,
    };
  },
  getBrandProductsGroupedByShelvesSucceeded(data: {
    shelves: DmdAdministration.MProductsByShelvesTree;
  }) {
    return {
      payload: { shelves: data.shelves },
      type: BrandProductsGroupedByShelvesReducerActionTypes.GET_SUCCEEDED as typeof BrandProductsGroupedByShelvesReducerActionTypes.GET_SUCCEEDED,
    };
  },
  getBrandProductsGroupedByShelvesFailed(error: Error) {
    return {
      payload: { error },
      type: BrandProductsGroupedByShelvesReducerActionTypes.GET_FAILED as typeof BrandProductsGroupedByShelvesReducerActionTypes.GET_FAILED,
    };
  },
};

type BrandProductsGroupedByShelvesReducerGetAction = ReturnType<
  typeof brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelves
>;
type BrandProductsGroupedByShelvesReducerGetSucceededAction = ReturnType<
  typeof brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelvesSucceeded
>;
type BrandProductsGroupedByShelvesReducerGetFailedAction = ReturnType<
  typeof brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelvesFailed
>;

type BrandProductsGroupedByShelvesReducerActions =
  | BrandProductsGroupedByShelvesReducerGetAction
  | BrandProductsGroupedByShelvesReducerGetSucceededAction
  | BrandProductsGroupedByShelvesReducerGetFailedAction;

const brandProductsGroupedByShelvesReducer: Reducer<
  BrandProductsGroupedByShelvesReducerState,
  BrandProductsGroupedByShelvesReducerActions
> = (state = brandProductsGroupedByShelvesReducerDefaultState, action) => {
  switch (action.type) {
    case BrandProductsGroupedByShelvesReducerActionTypes.GET: {
      return {
        ...state,
        data: null,
        requestInProgress: true,
      };
    }
    case BrandProductsGroupedByShelvesReducerActionTypes.GET_SUCCEEDED: {
      return {
        ...state,
        data: {
          shelves: action.payload.shelves,
        },
        requestInProgress: false,
      };
    }
    case BrandProductsGroupedByShelvesReducerActionTypes.GET_FAILED: {
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

const getBrandProductsGroupedByShelvesEpic: Epic<
  BrandProductsGroupedByShelvesReducerGetAction,
  any,
  AthenaStore,
  any
> = action$ =>
  action$.pipe(
    ofType(BrandProductsGroupedByShelvesReducerActionTypes.GET),
    switchMap(action =>
      ajax({
        url: getGateway(
          `/gateway/demand-administration/${action.payload.brandId}`
        ),
        method: 'GET',
      }).pipe(
        map(attempt =>
          brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelvesSucceeded(
            attempt.response
          )
        ),
        catchError((err, caught) =>
          of(
            brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelvesFailed(
              err
            )
          )
        )
      )
    )
  );

const brandProductsGroupedByShelvesEpics = [
  getBrandProductsGroupedByShelvesEpic,
];

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── COMMON ─────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export interface DemandAdministrationReducerState {
  brandProductsGroupedByShelves: BrandProductsGroupedByShelvesReducerState;
}

export const reducers = {
  brandProductsGroupedByShelves: brandProductsGroupedByShelvesReducer,
};

export const epics = [...brandProductsGroupedByShelvesEpics];
