import { RiseSVC } from 'olympus-anesidora';
import { Reducer } from 'redux';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { useCallback } from 'react';
import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import * as _ from 'lodash';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ofFeatureAndType } from './operators';
import { ajax, CustomAjaxResponse } from '../../shared/ajax';
import { getGateway } from '../../shared/utils';

export function getZonesDuck(featureName: string) {
  const feature = `[${featureName}] `;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION TYPES ───────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  enum GetZonesActionTypes {
    GET_ZONES = 'GET_ZONES',
    GET_ZONES_SUCCEEDED = 'GET_ZONES_SUCCEEDED',
    GET_ZONES_FAILED = 'GET_ZONES_FAILED',
    RESET_STORE = 'RESET_STORE',
  }

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION CREATORS ────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  interface GetZonesActionCreatorOptions {
    retailersIds?: string[];
    enabled?: boolean;
  }

  const getZonesActionCreators = {
    getZones(options: GetZonesActionCreatorOptions = {}) {
      return {
        feature,
        type: GetZonesActionTypes.GET_ZONES as typeof GetZonesActionTypes.GET_ZONES,
        payload: options,
      };
    },
    getZonesSucceeded(data: RiseSVC.Zone[]) {
      return {
        feature,
        type: GetZonesActionTypes.GET_ZONES_SUCCEEDED as typeof GetZonesActionTypes.GET_ZONES_SUCCEEDED,
        payload: { zones: data },
      };
    },
    getZonesFailed(error: Error) {
      return {
        feature,
        type: GetZonesActionTypes.GET_ZONES_FAILED as typeof GetZonesActionTypes.GET_ZONES_FAILED,
        payload: { error },
      };
    },
    resetStore() {
      return {
        feature,
        type: GetZonesActionTypes.RESET_STORE as typeof GetZonesActionTypes.RESET_STORE,
        payload: null,
      };
    }
  };

  type GetZonesAction = ReturnType<typeof getZonesActionCreators.getZones>;
  type GetZonesSucceededAction = ReturnType<
    typeof getZonesActionCreators.getZonesSucceeded
  >;
  type GetZonesFailedAction = ReturnType<
    typeof getZonesActionCreators.getZonesFailed
  >;
  type ResetStoreAction = ReturnType<
    typeof getZonesActionCreators.resetStore
>;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── STATE ──────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  interface GetZonesReducerState {
    data: RiseSVC.Zone[];
    error: Error | null;
    requestInProgress: boolean;
  }

  const getZonesDefaultState: GetZonesReducerState = {
    data: [],
    error: null,
    requestInProgress: false,
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── REDUCER ────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  type GetZonesReducerActions =
    | GetZonesAction
    | GetZonesSucceededAction
    | GetZonesFailedAction
    | ResetStoreAction;

  const getZonesReducer: Reducer<
    GetZonesReducerState,
    GetZonesReducerActions
  > = (state = getZonesDefaultState, action) => {
    if (action.feature === feature) {
      switch (action.type) {
        case GetZonesActionTypes.GET_ZONES: {
          return {
            ...state,
            data: [],
            requestInProgress: true,
          };
        }
        case GetZonesActionTypes.GET_ZONES_SUCCEEDED: {
          return {
            ...state,
            data: action.payload.zones,
            requestInProgress: false,
          };
        }
        case GetZonesActionTypes.GET_ZONES_FAILED: {
          return {
            ...state,
            error: action.payload.error,
            requestInProgress: false,
          };
        }
        case GetZonesActionTypes.RESET_STORE: {
          return { ...getZonesDefaultState };
        }
        default: {
          return state;
        }
      }
    }
    return state;
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── EPICS ──────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const getZonesEpic: Epic<GetZonesAction, any, any, any> = action$ => {
    return action$.pipe(
      ofFeatureAndType(feature, GetZonesActionTypes.GET_ZONES),
      switchMap(action => {
        let filter = '';

        if (action.payload.retailersIds && action.payload.retailersIds.length) {
          filter += `filter[retailer_id]=${action.payload.retailersIds.join(
            ','
          )}`;
        }

        if (action.payload.enabled !== undefined) {
          filter += `${filter ? '&' : ''}filter[enabled]=${
            action.payload.enabled
          }`;
        }

        return ajax({
          url: getGateway(
            `/gateway/demand-line-items/zones${filter ? `?${filter}` : ''}`
          ),
          method: 'GET',
        }).pipe(
          map(attempt =>
            getZonesActionCreators.getZonesSucceeded(attempt.response)
          ),
          catchError((err, caught) =>
            of(getZonesActionCreators.getZonesFailed(err))
          )
        );
      })
    );
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── USE ────────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const mapIsZonesDuckStoreRegistered = (store: any) => {
    return _.get(store, featureName) !== undefined;
  };
  const useIsZonesDuckStoreRegistered = () => {
    return useMappedState(mapIsZonesDuckStoreRegistered);
  }

  const useGetAllZones = () => {
    const dispatch = useDispatch();
    return useCallback((options: GetZonesActionCreatorOptions = {}) => {
      return dispatch(getZonesActionCreators.getZones(options));
    }, []);
  };

  const useResetStore = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
      return dispatch(getZonesActionCreators.resetStore());
    }, []);
  }

  const mapStateToProps = (store: any) => {
    const res: GetZonesReducerState | undefined = _.get(store, featureName);
    return res || getZonesDefaultState;
  };

  const useZones = () => {
    return useMappedState(mapStateToProps);
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── BUNDLING ───────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const getZonesEpics = [getZonesEpic];

  return {
    defaultState: getZonesDefaultState,
    actionCreators: getZonesActionCreators,
    epics: getZonesEpics,
    reducers: getZonesReducer,
    useIsZonesDuckStoreRegistered,
    useGetAllZones,
    useZones,
    useResetStore,
  };
}
