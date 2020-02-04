import { Epic, ofType } from 'redux-observable';
import { of, throwError } from 'rxjs';
import { catchError, map, mergeMap, retry, switchMap } from 'rxjs/operators';
import { RiseSVC } from 'olympus-anesidora';
import { ajax, CustomAjaxResponse } from '../shared/ajax';

import * as logger from '../shared/logger';

import { getGateway } from '../shared/utils';

export {
  useZones,
  useGetAllZones,
  useUpdateZone,
  useUpdateZones,
  useCreateZonesPrices,
} from './use';

export enum types {
  GET_ZONES = '[supply-zones] GET_ZONES',
  GET_ZONES_SUCCEED = '[supply-zones] GET_ZONES_SUCCEED',
  GET_ZONES_FAILED = '[demand-zones] GET_ZONES_FAILED',
  UPDATE_ZONE = '[supply-zones] UPDATE_ZONE',
  UPDATE_ZONE_SUCCEED = '[supply-zones] UPDATE_ZONE_SUCCEED',
  UPDATE_ZONE_FAILED = '[supply-zones] UPDATE_ZONE_FAILED',
  UPDATE_ZONES = '[supply-zones] UPDATE_ZONES',
  UPDATE_ZONES_SUCCEED = '[supply-zones] UPDATE_ZONES_SUCCEED',
  UPDATE_ZONES_FAILED = '[supply-zones] UPDATE_ZONES_FAILED',
  CREATE_ZONES_PRICES = '[supply-zones] CREATE_ZONES_PRICES',
  CREATE_ZONES_PRICES_SUCCEED = '[supply-zones] CREATE_ZONES_PRICES_SUCCEED',
  CREATE_ZONES_PRICES_FAILED = '[supply-zones] CREATE_ZONES_PRICES_FAILED',
}

interface ServerError {
  status: number;
  message: string;
}

export interface SupplyZonesState {
  zones: RiseSVC.Zone[];
}

const getZonesAction = () => ({
  type: types.GET_ZONES as typeof types.GET_ZONES,
});

const getZonesSucceedAction = (zones: RiseSVC.Zone[]) => ({
  payload: zones,
  type: types.GET_ZONES_SUCCEED as typeof types.GET_ZONES_SUCCEED,
});

const getZonesFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.GET_ZONES_FAILED as typeof types.GET_ZONES_FAILED,
});

const updateZoneAction = (zone: any) => ({
  payload: zone,
  type: types.UPDATE_ZONE as typeof types.UPDATE_ZONE,
});

const updateZoneSucceedAction = ({ zone }: any) => ({
  payload: zone,
  type: types.UPDATE_ZONE_SUCCEED as typeof types.UPDATE_ZONE_SUCCEED,
});

const updateZoneFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.UPDATE_ZONE_FAILED as typeof types.UPDATE_ZONE_FAILED,
});

const updateZonesAction = (zones: any) => ({
  payload: zones,
  type: types.UPDATE_ZONES as typeof types.UPDATE_ZONES,
});

const updateZonesSucceedAction = ({ zones }: any) => ({
  payload: zones,
  type: types.UPDATE_ZONES_SUCCEED as typeof types.UPDATE_ZONES_SUCCEED,
});

const updateZonesFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.UPDATE_ZONES_FAILED as typeof types.UPDATE_ZONES_FAILED,
});

const createZonesPricesAction = (zones: any) => ({
  payload: zones,
  type: types.CREATE_ZONES_PRICES as typeof types.CREATE_ZONES_PRICES,
});

const createZonesPricesSucceedAction = (payload: any) => ({
  payload,
  type: types.CREATE_ZONES_PRICES_SUCCEED as typeof types.CREATE_ZONES_PRICES_SUCCEED,
});

const createZonesPricesFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.CREATE_ZONES_PRICES_FAILED as typeof types.CREATE_ZONES_PRICES_FAILED,
});

type GetZonesAction = ReturnType<typeof getZonesAction>;
type GetZonesSucceedAction = ReturnType<typeof getZonesSucceedAction>;
type GetZonesFailedAction = ReturnType<typeof getZonesFailedAction>;
type UpdateZoneAction = ReturnType<typeof updateZoneAction>;
type UpdateZoneSucceedAction = ReturnType<typeof updateZoneSucceedAction>;
type UpdateZoneFailedAction = ReturnType<typeof updateZoneFailedAction>;
type UpdateZonesAction = ReturnType<typeof updateZonesAction>;
type UpdateZonesSucceedAction = ReturnType<typeof updateZonesSucceedAction>;
type UpdateZonesFailedAction = ReturnType<typeof updateZonesFailedAction>;
type CreateZonesPricesAction = ReturnType<typeof createZonesPricesAction>;
type CreateZonesPricesSucceedAction = ReturnType<
  typeof createZonesPricesSucceedAction
>;
type CreateZonesPricesFailedAction = ReturnType<
  typeof createZonesPricesFailedAction
>;

type Actions =
  | GetZonesAction
  | GetZonesSucceedAction
  | GetZonesFailedAction
  | UpdateZoneAction
  | UpdateZoneSucceedAction
  | UpdateZoneFailedAction
  | UpdateZonesAction
  | UpdateZonesSucceedAction
  | UpdateZonesFailedAction
  | CreateZonesPricesAction
  | CreateZonesPricesSucceedAction
  | CreateZonesPricesFailedAction;

export const actions = {
  getZones: getZonesAction,
  updateZone: updateZoneAction,
  updateZones: updateZonesAction,
  createZonesPrices: createZonesPricesAction,
};

export const zonesDefaultState = {
  zones: [],
};

const zonesReducer = (
  state: SupplyZonesState = zonesDefaultState,
  action: Actions
) => {
  switch (action.type) {
    case types.GET_ZONES_SUCCEED:
      return { ...state, zones: action.payload };
    case types.UPDATE_ZONE_SUCCEED:
      return { ...state, zone: action.payload };
    case types.UPDATE_ZONES_SUCCEED:
      return { ...state, zones: action.payload };
    case types.CREATE_ZONES_PRICES_SUCCEED:
      return { ...state, zones: action.payload.zones };
    default:
      return state;
  }
};

export const reducers = { zones: zonesReducer };

const getZone$: Epic = action$ =>
  action$.pipe(
    ofType(types.GET_ZONES),
    switchMap((action: GetZonesAction) =>
      ajax({
        url: getGateway('/gateway/supply-formats'),
        method: 'GET',
      }).pipe(
        map(attempt => getZonesSucceedAction(attempt.response.zones)),
        catchError((err: any, caught: any) => {
          logger.error(err);
          return throwError({
            message: 'Rise says No!',
            status: 500,
          });
        })
      )
    )
  );

const updateZone$: Epic = action$ =>
  action$.pipe(
    ofType(types.UPDATE_ZONE),
    mergeMap((action: UpdateZoneAction) => {
      const zoneId = action.payload.id || '';
      return ajax({
        url: getGateway(`/gateway/supply-zones/${zoneId}`),
        method: 'PUT',
        body: {
          ...action.payload,
        },
      }).pipe(
        map(attempt => updateZoneSucceedAction(attempt.response)),
        catchError((err, caught) => of(updateZoneFailedAction(err)))
      );
    })
  );

const updateZones$: Epic = action$ =>
  action$.pipe(
    ofType(types.UPDATE_ZONES),
    mergeMap((action: UpdateZonesAction) => {
      return ajax({
        url: getGateway(`/gateway/supply-formats`),
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: { zones: action.payload },
      }).pipe(
        map(attempt => updateZonesSucceedAction(attempt.response)),
        catchError((err, caught) => of(updateZonesFailedAction(err)))
      );
    })
  );

const createZonesPrices$: Epic = action$ =>
  action$.pipe(
    ofType(types.CREATE_ZONES_PRICES),
    mergeMap((action: UpdateZonesAction) => {
      return ajax({
        url: getGateway(`/gateway/supply-inventory-prices`),
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: action.payload,
      }).pipe(
        map(attempt => createZonesPricesSucceedAction(attempt.response)),
        catchError((err, caught) => of(createZonesPricesFailedAction(err)))
      );
    })
  );

export const epics = [getZone$, updateZone$, updateZones$, createZonesPrices$];
