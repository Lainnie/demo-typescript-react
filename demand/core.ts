import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, CustomAjaxResponse } from '../shared/ajax';
import { catchError, map, retry, switchMap } from 'rxjs/operators';

import { getGateway } from '../shared/utils';
import { BrandsSVC } from 'olympus-anesidora';

export { useBrands, useGetAllBrands } from './use';

export enum types {
  GET_ALL_BRANDS = '[demand] GET_ALL_BRANDS',
  GET_ALL_BRANDS_SUCCEED = '[demand] GET_ALL_BRANDS_SUCCEED',
  GET_ALL_BRANDS_FAILED = '[demand] GET_ALL_BRANDS_FAILED',
}

interface ServerError {
  status: number;
  message: string;
}

const getBrandsAction = () => ({
  type: types.GET_ALL_BRANDS as typeof types.GET_ALL_BRANDS,
});

const getBrandsSucceedAction = (brands: BrandsSVC.Brand[]) => ({
  payload: brands,
  type: types.GET_ALL_BRANDS_SUCCEED as typeof types.GET_ALL_BRANDS_SUCCEED,
});

const getBrandsFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_ALL_BRANDS_FAILED as typeof types.GET_ALL_BRANDS_FAILED,
});

type GetBrandsAction = ReturnType<typeof getBrandsAction>;
type GetBrandsSucceededAction = ReturnType<typeof getBrandsSucceedAction>;
type GetBrandsFailedAction = ReturnType<typeof getBrandsFailedAction>;

type Actions =
  | GetBrandsAction
  | GetBrandsSucceededAction
  | GetBrandsFailedAction;

export const actions = {
  getBrands: getBrandsAction,
  getBrandsFailed: getBrandsFailedAction,
  getBrandsSucceed: getBrandsSucceedAction,
};

export interface MainState {
  brands: BrandsSVC.Brand[];
}

const demandDefaultState = {
  brands: [] as BrandsSVC.Brand[],
};

const main = (state: MainState = demandDefaultState, action: Actions) => {
  switch (action.type) {
    case types.GET_ALL_BRANDS_SUCCEED:
      return {
        ...state,
        brands: action.payload,
      };
    default:
      return state;
  }
};

export const reducers = {
  main,
};

const getBrands$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_ALL_BRANDS),
    switchMap((action: GetBrandsAction) =>
      ajax({
        url: getGateway('/gateway/demand-administration'),
        method: 'GET',
      }).pipe(
        map(({ response }) => getBrandsSucceedAction(response.brands)),
        retry(2),
        catchError((err, caught) => of(getBrandsFailedAction(err)))
      )
    )
  );

export const epics = [getBrands$];
