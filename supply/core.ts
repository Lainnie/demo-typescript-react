import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { RiseSVC } from 'olympus-anesidora';
import { ajax, CustomAjaxResponse } from '../shared/ajax';
import { catchError, map, retry, switchMap } from 'rxjs/operators';

import { getGateway } from '../shared/utils';

export * from './use';

export enum types {
  GET_ALL_RETAILERS = '[supply] GET_ALL_RETAILERS',
  GET_ALL_RETAILERS_SUCCEED = '[supply] GET_ALL_RETAILERS_SUCCEED',
  GET_ALL_RETAILERS_FAILED = '[supply] GET_ALL_RETAILERS_FAILED',
  UPDATE_RETAILERS = '[supply] UPDATE_RETAILERS',
  UPDATE_RETAILERS_SUCCEED = '[supply] UPDATE_RETAILERS_SUCCEED',
  UPDATE_RETAILERS_FAILED = '[supply] UPDATE_RETAILERS_FAILED',
}

const getRetailersAction = () => ({
  type: types.GET_ALL_RETAILERS as typeof types.GET_ALL_RETAILERS,
});

const getRetailersSucceedAction = (retailers: RiseSVC.Retailer[]) => ({
  payload: retailers,
  type: types.GET_ALL_RETAILERS_SUCCEED as typeof types.GET_ALL_RETAILERS_SUCCEED,
});

const getRetailersFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_ALL_RETAILERS_FAILED as typeof types.GET_ALL_RETAILERS_FAILED,
});

const updateRetailersAction = (retailers: RiseSVC.Retailer) => ({
  payload: retailers,
  type: types.UPDATE_RETAILERS as typeof types.UPDATE_RETAILERS,
});

const updateRetailersSucceedAction = (retailers: RiseSVC.Retailer) => ({
  payload: retailers,
  type: types.UPDATE_RETAILERS_SUCCEED as typeof types.UPDATE_RETAILERS_SUCCEED,
});

const updateRetailersFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.UPDATE_RETAILERS_FAILED as typeof types.UPDATE_RETAILERS_FAILED,
});

type GetRetailersAction = ReturnType<typeof getRetailersAction>;
type GetRetailersSucceededAction = ReturnType<typeof getRetailersSucceedAction>;
type GetRetailersFailedAction = ReturnType<typeof getRetailersFailedAction>;
type UpdateRetailersAction = ReturnType<typeof updateRetailersAction>;
type UpdateRetailersSucceededAction = ReturnType<
  typeof updateRetailersSucceedAction
>;
type UpdateRetailersFailedAction = ReturnType<
  typeof updateRetailersFailedAction
>;

type Actions =
  | GetRetailersAction
  | GetRetailersSucceededAction
  | GetRetailersFailedAction
  | UpdateRetailersAction
  | UpdateRetailersSucceededAction
  | UpdateRetailersFailedAction;

export const actions = {
  getRetailers: getRetailersAction,
  getRetailersFailed: getRetailersFailedAction,
  getRetailersSucceed: getRetailersSucceedAction,
  updateRetailers: updateRetailersAction,
  updateRetailersFailed: updateRetailersFailedAction,
  updateRetailersSucceed: updateRetailersSucceedAction,
};

interface ServerError {
  status: number;
  message: string;
}

export interface MainState {
  retailers: RiseSVC.Retailer[];
}

const supplyDefaultState = {
  retailers: [] as RiseSVC.Retailer[],
};

const supply = (state: MainState = supplyDefaultState, action: Actions) => {
  switch (action.type) {
    case types.GET_ALL_RETAILERS_SUCCEED:
    case types.UPDATE_RETAILERS_SUCCEED:
      return {
        ...state,
        retailers: action.payload,
      };
    default:
      return state;
  }
};

export const reducers = {
  main: supply,
};

const getRetailers$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_ALL_RETAILERS),
    switchMap((action: GetRetailersAction) =>
      ajax({
        url: getGateway('/gateway/supply-retailers'),
        method: 'GET',
      }).pipe(
        map(({ response }) => getRetailersSucceedAction(response.retailers)),
        retry(2),
        catchError((err, caught) => of(getRetailersFailedAction(err)))
      )
    )
  );

const updateRetailers$: Epic = action$ =>
  action$.pipe(
    ofType(types.UPDATE_RETAILERS),
    switchMap((action: UpdateRetailersAction) =>
      ajax({
        url: getGateway('/gateway/supply-retailers'),
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: { retailers: action.payload },
      }).pipe(
        map(({ response }) => updateRetailersSucceedAction(response.retailers)),
        retry(2),
        catchError((err, caught) => of(updateRetailersFailedAction(err)))
      )
    )
  );

export const epics = [getRetailers$, updateRetailers$];
