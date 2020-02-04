import { Reducer } from 'redux';
import { RiseSVC, MeccaSVC } from 'olympus-anesidora';
import { Epic, ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { getGateway } from '../shared/utils';
import { ajax, CustomAjaxResponse } from '../shared/ajax';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── CATEGORIES & GROUPS ────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

enum CategoriesAndGroupsReducerActionTypes {
  GET = 'supplyAdministration/categoriesAndGroups/GET',
  GET_SUCCEEDED = 'supplyAdministration/categoriesAndGroups/GET_SUCCEEDED',
  GET_FAILED = 'supplyAdministration/categoriesAndGroups/GET_FAILED',
}

export interface CategoriesAndGroupsReducerState {
  data: {
    groups: RiseSVC.RetailerGroup[];
    /** Level-1 Shelves only */
    categories: MeccaSVC.Shelf[];
  } | null;
  error: Error | null;
  requestInProgress: boolean;
}

export const categoriesAndGroupsReducerDefaultState: CategoriesAndGroupsReducerState = {
  data: null,
  error: null,
  requestInProgress: false,
};

export const categoriesAndGroupsReducerActions = {
  getCategoriesAndGroups({
    categoryIds,
    groupIds,
  }: {
    categoryIds: string[];
    groupIds: string[];
  }) {
    return {
      payload: { categoryIds, groupIds },
      type: CategoriesAndGroupsReducerActionTypes.GET as typeof CategoriesAndGroupsReducerActionTypes.GET,
    };
  },
  getCategoriesAndGroupsSucceeded({
    categories,
    groups,
  }: {
    categories: MeccaSVC.Shelf[];
    groups: RiseSVC.RetailerGroup[];
  }) {
    return {
      payload: { categories, groups },
      type: CategoriesAndGroupsReducerActionTypes.GET_SUCCEEDED as typeof CategoriesAndGroupsReducerActionTypes.GET_SUCCEEDED,
    };
  },
  getCategoriesAndGroupsFailed(error: Error) {
    return {
      payload: { error },
      type: CategoriesAndGroupsReducerActionTypes.GET_FAILED as typeof CategoriesAndGroupsReducerActionTypes.GET_FAILED,
    };
  },
};

type CategoriesAndGroupsReducerGetAction = ReturnType<
  typeof categoriesAndGroupsReducerActions.getCategoriesAndGroups
>;
type CategoriesAndGroupsReducerGetSucceededAction = ReturnType<
  typeof categoriesAndGroupsReducerActions.getCategoriesAndGroupsSucceeded
>;
type CategoriesAndGroupsReducerGetFailedAction = ReturnType<
  typeof categoriesAndGroupsReducerActions.getCategoriesAndGroupsFailed
>;

type CategoriesAndGroupsReducerActions =
  | CategoriesAndGroupsReducerGetAction
  | CategoriesAndGroupsReducerGetSucceededAction
  | CategoriesAndGroupsReducerGetFailedAction;

const categoriesAndGroupsReducer: Reducer<
  CategoriesAndGroupsReducerState,
  CategoriesAndGroupsReducerActions
> = (state = categoriesAndGroupsReducerDefaultState, action) => {
  switch (action.type) {
    case CategoriesAndGroupsReducerActionTypes.GET: {
      return {
        ...state,
        data: null,
        requestInProgress: true,
      };
    }
    case CategoriesAndGroupsReducerActionTypes.GET_SUCCEEDED: {
      return {
        ...state,
        data: {
          categories: action.payload.categories,
          groups: action.payload.groups,
        },
        requestInProgress: false,
      };
    }
    case CategoriesAndGroupsReducerActionTypes.GET_FAILED: {
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

const getCategoriesAndGroupsEpic: Epic<
  CategoriesAndGroupsReducerGetAction,
  any,
  any,
  any
> = action$ => {
  return action$.pipe(
    ofType(CategoriesAndGroupsReducerActionTypes.GET),
    switchMap(action =>
      ajax({
        url: getGateway(`/gateway/supply-administration`),
        method: 'POST',
        body: {
          categoryIds: action.payload.categoryIds,
          groupIds: action.payload.groupIds,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).pipe(
        map(attempt =>
          categoriesAndGroupsReducerActions.getCategoriesAndGroupsSucceeded(
            attempt.response
          )
        ),
        catchError((err, caught) =>
          of(
            categoriesAndGroupsReducerActions.getCategoriesAndGroupsFailed(err)
          )
        )
      )
    )
  );
};

const categorieAndGroupsEpics = [getCategoriesAndGroupsEpic];

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── COMMON ─────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export interface SupplyAdministrationReducerState {
  categoriesAndGroups: CategoriesAndGroupsReducerState;
}

export const reducers = {
  categoriesAndGroups: categoriesAndGroupsReducer,
};

export const epics = [...categorieAndGroupsEpics];
