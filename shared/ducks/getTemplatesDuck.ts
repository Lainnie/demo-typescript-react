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

export function getTemplatesDuck(featureName: string) {
  const feature = `[${featureName}] `;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION TYPES ───────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  enum GetTemplatesActionTypes {
    GET_TEMPLATES = 'GET_TEMPLATES',
    GET_TEMPLATES_SUCCEEDED = 'GET_TEMPLATES_SUCCEEDED',
    GET_TEMPLATES_FAILED = 'GET_TEMPLATES_FAILED',
    RESET_STORE = 'RESET_STORE',
  }

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION CREATORS ────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  interface GetTemplatesActionCreatorOptions {}

  const getTemplatesActionCreators = {
    getTemplates(options: GetTemplatesActionCreatorOptions = {}) {
      return {
        feature,
        type: GetTemplatesActionTypes.GET_TEMPLATES as typeof GetTemplatesActionTypes.GET_TEMPLATES,
        payload: options,
      };
    },
    getTemplatesSucceeded(data: RiseSVC.Template[]) {
      return {
        feature,
        type: GetTemplatesActionTypes.GET_TEMPLATES_SUCCEEDED as typeof GetTemplatesActionTypes.GET_TEMPLATES_SUCCEEDED,
        payload: { templates: data },
      };
    },
    getTemplatesFailed(error: Error) {
      return {
        feature,
        type: GetTemplatesActionTypes.GET_TEMPLATES_FAILED as typeof GetTemplatesActionTypes.GET_TEMPLATES_FAILED,
        payload: { error },
      };
    },
    resetStore() {
      return {
        feature,
        type: GetTemplatesActionTypes.RESET_STORE as typeof GetTemplatesActionTypes.RESET_STORE,
        payload: null,
      };
    }
  };

  type GetTemplatesAction = ReturnType<
    typeof getTemplatesActionCreators.getTemplates
  >;
  type GetTemplatesSucceededAction = ReturnType<
    typeof getTemplatesActionCreators.getTemplatesSucceeded
  >;
  type GetTemplatesFailedAction = ReturnType<
    typeof getTemplatesActionCreators.getTemplatesFailed
  >;
  type ResetStoreAction = ReturnType<
    typeof getTemplatesActionCreators.resetStore
  >;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── STATE ──────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  interface GetTemplatesReducerState {
    data: RiseSVC.Template[];
    error: Error | null;
    requestInProgress: boolean;
  }

  const getTemplatesDefaultState: GetTemplatesReducerState = {
    data: [],
    error: null,
    requestInProgress: false,
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── REDUCER ────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  type GetTemplatesReducerActions =
    | GetTemplatesAction
    | GetTemplatesSucceededAction
    | GetTemplatesFailedAction
    | ResetStoreAction;

  const getTemplatesReducer: Reducer<
    GetTemplatesReducerState,
    GetTemplatesReducerActions
  > = (state = getTemplatesDefaultState, action) => {
    if (action.feature === feature) {
      switch (action.type) {
        case GetTemplatesActionTypes.GET_TEMPLATES: {
          return {
            ...state,
            data: [],
            requestInProgress: true,
          };
        }
        case GetTemplatesActionTypes.GET_TEMPLATES_SUCCEEDED: {
          return {
            ...state,
            data: action.payload.templates,
            requestInProgress: false,
          };
        }
        case GetTemplatesActionTypes.GET_TEMPLATES_FAILED: {
          return {
            ...state,
            error: action.payload.error,
            requestInProgress: false,
          };
        }
        case GetTemplatesActionTypes.RESET_STORE: {
          return { ...getTemplatesDefaultState };
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

  const getTemplatesEpic: Epic<GetTemplatesAction, any, any, any> = action$ => {
    return action$.pipe(
      ofFeatureAndType(feature, GetTemplatesActionTypes.GET_TEMPLATES),
      switchMap(action => {
        return ajax({
          url: getGateway('/gateway/demand-line-items/templates'),
          method: 'GET',
        }).pipe(
          map(attempt =>
            getTemplatesActionCreators.getTemplatesSucceeded(attempt.response)
          ),
          catchError((err, caught) =>
            of(getTemplatesActionCreators.getTemplatesFailed(err))
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

  const mapIsTemplatesDuckStoreRegistered = (store: any) => {
    return _.get(store, featureName) !== undefined;
  };
  const useIsTemplatesDuckStoreRegistered = () => {
    return useMappedState(mapIsTemplatesDuckStoreRegistered);
  }

  const useGetAllTemplates = () => {
    const dispatch = useDispatch();
    return useCallback((options: GetTemplatesActionCreatorOptions = {}) => {
      return dispatch(getTemplatesActionCreators.getTemplates(options));
    }, []);
  };

  const useResetStore = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
      return dispatch(getTemplatesActionCreators.resetStore());
    }, []);
  }

  const mapStateToProps = (store: any) => {
    const res: GetTemplatesReducerState | undefined = _.get(store, featureName);
    return res || getTemplatesDefaultState;
  };

  const useTemplates = () => {
    return useMappedState(mapStateToProps);
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── BUNDLING ───────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const getTemplatesEpics = [getTemplatesEpic];

  return {
    defaultState: getTemplatesDefaultState,
    actionCreators: getTemplatesActionCreators,
    epics: getTemplatesEpics,
    reducers: getTemplatesReducer,
    useIsTemplatesDuckStoreRegistered,
    useGetAllTemplates,
    useTemplates,
    useResetStore,
  };
}
