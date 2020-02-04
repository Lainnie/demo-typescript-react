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

export function getFormatsDuck(featureName: string) {
  const feature = `[${featureName}] `;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION TYPES ───────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  enum GetFormatsActionTypes {
    GET_FORMATS = 'GET_FORMATS',
    GET_FORMATS_SUCCEEDED = 'GET_FORMATS_SUCCEEDED',
    GET_FORMATS_FAILED = 'GET_FORMATS_FAILED',
    RESET_STORE = 'RESET_STORE',
  }

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION CREATORS ────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  interface GetFormatsActionCreatorOptions {
    ids?: string[];
  }

  const getFormatsActionCreators = {
    getFormats(options: GetFormatsActionCreatorOptions = {}) {
      return {
        feature,
        type: GetFormatsActionTypes.GET_FORMATS as typeof GetFormatsActionTypes.GET_FORMATS,
        payload: options,
      };
    },
    getFormatsSucceeded(data: RiseSVC.Format[]) {
      return {
        feature,
        type: GetFormatsActionTypes.GET_FORMATS_SUCCEEDED as typeof GetFormatsActionTypes.GET_FORMATS_SUCCEEDED,
        payload: { formats: data },
      };
    },
    getFormatsFailed(error: Error) {
      return {
        feature,
        type: GetFormatsActionTypes.GET_FORMATS_FAILED as typeof GetFormatsActionTypes.GET_FORMATS_FAILED,
        payload: { error },
      };
    },
    resetStore() {
      return {
        feature,
        type: GetFormatsActionTypes.RESET_STORE as typeof GetFormatsActionTypes.RESET_STORE,
        payload: null,
      };
    }
  };

  type GetFormatsAction = ReturnType<
    typeof getFormatsActionCreators.getFormats
  >;
  type GetFormatsSucceededAction = ReturnType<
    typeof getFormatsActionCreators.getFormatsSucceeded
  >;
  type GetFormatsFailedAction = ReturnType<
    typeof getFormatsActionCreators.getFormatsFailed
  >;
  type ResetStoreAction = ReturnType<
    typeof getFormatsActionCreators.resetStore
  >;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── STATE ──────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  interface GetFormatsReducerState {
    data: RiseSVC.Format[];
    error: Error | null;
    requestInProgress: boolean;
  }

  const getFormatsDefaultState: GetFormatsReducerState = {
    data: [],
    error: null,
    requestInProgress: false,
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── REDUCER ────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  type GetFormatsReducerActions =
    | GetFormatsAction
    | GetFormatsSucceededAction
    | GetFormatsFailedAction
    | ResetStoreAction;

  const getFormatsReducer: Reducer<
    GetFormatsReducerState,
    GetFormatsReducerActions
  > = (state = getFormatsDefaultState, action) => {
    if (action.feature === feature) {
      switch (action.type) {
        case GetFormatsActionTypes.GET_FORMATS: {
          return {
            ...state,
            data: [],
            requestInProgress: true,
          };
        }
        case GetFormatsActionTypes.GET_FORMATS_SUCCEEDED: {
          return {
            ...state,
            data: action.payload.formats,
            requestInProgress: false,
          };
        }
        case GetFormatsActionTypes.GET_FORMATS_FAILED: {
          return {
            ...state,
            error: action.payload.error,
            requestInProgress: false,
          };
        }
        case GetFormatsActionTypes.RESET_STORE: {
          return { ...getFormatsDefaultState };
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

  const getFormatsEpic: Epic<GetFormatsAction, any, any, any> = action$ => {
    return action$.pipe(
      ofFeatureAndType(feature, GetFormatsActionTypes.GET_FORMATS),
      switchMap(action => {
        let filter = '';

        if (action.payload.ids && action.payload.ids.length) {
          filter += `filter[id]=${action.payload.ids.join(',')}`;
        }

        return ajax({
          url: getGateway(
            `/gateway/demand-line-items/formats${filter ? `?${filter}` : ''}`
          ),
          method: 'GET',
        }).pipe(
          map(attempt =>
            getFormatsActionCreators.getFormatsSucceeded(attempt.response)
          ),
          catchError((err, caught) =>
            of(getFormatsActionCreators.getFormatsFailed(err))
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

  const mapIsFormatsDuckStoreRegistered = (store: any) => {
    return _.get(store, featureName) !== undefined;
  };
  const useIsFormatsDuckStoreRegistered = () => {
    return useMappedState(mapIsFormatsDuckStoreRegistered);
  }

  const useGetAllFormats = () => {
    const dispatch = useDispatch();
    return useCallback((options: GetFormatsActionCreatorOptions = {}) => {
      return dispatch(getFormatsActionCreators.getFormats(options));
    }, []);
  };

  const useResetStore = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
      return dispatch(getFormatsActionCreators.resetStore());
    }, []);
  };

  const mapStateToProps = (store: any) => {
    const res: GetFormatsReducerState | undefined = _.get(store, featureName);
    return res || getFormatsDefaultState;
  };

  const useFormats = () => {
    return useMappedState(mapStateToProps);
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── BUNDLING ───────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const getFormatsEpics = [getFormatsEpic];

  return {
    defaultState: getFormatsDefaultState,
    actionCreators: getFormatsActionCreators,
    epics: getFormatsEpics,
    reducers: getFormatsReducer,
    useIsFormatsDuckStoreRegistered,
    useGetAllFormats,
    useFormats,
    useResetStore,
  };
}
