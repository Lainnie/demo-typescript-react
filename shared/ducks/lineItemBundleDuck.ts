import { RiseSVC, CrownSVC } from 'olympus-anesidora';
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
import { LineItemBundleJson } from '../../demand-workflow-line-items/utils';

export interface LineItemBundle {
  lineItem: CrownSVC.LineItem;
  lineItemRetailers: CrownSVC.LineItemRetailer[];
  creatives: CrownSVC.Creative[];
}

export interface LineItemBundleReducerState {
  datum: LineItemBundle | null;
  error: Error | null;
  requestInProgress: boolean;
}


export function lineItemBundleDuck(featureName: string) {
  const feature = `[${featureName}] `;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION TYPES ───────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  enum lineItemBundleActionTypes {
    GET_LINEITEM_BUNDLE = 'GET_LINEITEM_BUNDLE',
    GET_LINEITEM_BUNDLE_SUCCEEDED = 'GET_LINEITEM_BUNDLE_SUCCEEDED',
    GET_LINEITEM_BUNDLE_FAILED = 'GET_LINEITEM_BUNDLE_FAILED',
    UPDATE_LINEITEM_BUNDLE = 'UPDATE_LINEITEM_BUNDLE',
    UPDATE_LINEITEM_BUNDLE_SUCCEEDED = 'UPDATE_LINEITEM_BUNDLE_SUCCEEDED',
    UPDATE_LINEITEM_BUNDLE_FAILED = 'UPDATE_LINEITEM_BUNDLE_FAILED',
    RESET_STORE = 'RESET_STORE',
  }

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── ACTION CREATORS ────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const lineItemBundleActionCreators = {
    // [[ GET ]]
    getLineItemBundle(id: string) {
      return {
        feature,
        type: lineItemBundleActionTypes.GET_LINEITEM_BUNDLE as typeof lineItemBundleActionTypes.GET_LINEITEM_BUNDLE,
        payload: { id },
      };
    },
    getLineItemBundleSucceeded(bundle: LineItemBundle) {
      return {
        feature,
        type: lineItemBundleActionTypes.GET_LINEITEM_BUNDLE_SUCCEEDED as typeof lineItemBundleActionTypes.GET_LINEITEM_BUNDLE_SUCCEEDED,
        payload: bundle,
      };
    },
    getLineItemBundleFailed(error: Error) {
      return {
        feature,
        type: lineItemBundleActionTypes.GET_LINEITEM_BUNDLE_FAILED as typeof lineItemBundleActionTypes.GET_LINEITEM_BUNDLE_FAILED,
        payload: { error },
      };
    },
    // [[ UPDATE ]]
    updateLineItemBundle(bundleJson: LineItemBundleJson) {
      return {
        feature,
        type: lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE as typeof lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE,
        payload: { id: bundleJson.lineItem.id! },
      };
    },
    updateLineItemBundleSucceeded(bundle: LineItemBundle) {
      return {
        feature,
        type: lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE_SUCCEEDED as typeof lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE_SUCCEEDED,
        payload: bundle,
      };
    },
    updateLineItemBundleFailed(error: Error) {
      return {
        feature,
        type: lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE_FAILED as typeof lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE_FAILED,
        payload: { error },
      };
    },
    resetStore() {
      return {
        feature,
        type: lineItemBundleActionTypes.RESET_STORE as typeof lineItemBundleActionTypes.RESET_STORE,
        payload: null,
      };
    }
  };

  // [[ GET ]]
  type GetLineItemBundleAction = ReturnType<
    typeof lineItemBundleActionCreators.getLineItemBundle
  >;
  type GetLineItemBundleSucceededAction = ReturnType<
    typeof lineItemBundleActionCreators.getLineItemBundleSucceeded
  >;
  type GetLineItemBundleFailedAction = ReturnType<
    typeof lineItemBundleActionCreators.getLineItemBundleFailed
  >;
  // [[ UPDATE]]
  type UpdateLineItemBundleAction = ReturnType<
    typeof lineItemBundleActionCreators.updateLineItemBundle
  >;
  type UpdateLineItemBundleSucceededAction = ReturnType<
    typeof lineItemBundleActionCreators.updateLineItemBundleSucceeded
  >;
  type UpdateLineItemBundleFailedAction = ReturnType<
    typeof lineItemBundleActionCreators.updateLineItemBundleFailed
  >;
  type ResetStoreAction = ReturnType<
    typeof lineItemBundleActionCreators.resetStore
  >;

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── STATE ──────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const lineItemBundleDefaultState: LineItemBundleReducerState = {
    datum: null,
    error: null,
    requestInProgress: false,
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── REDUCER ────────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  type LineItemBundleReducerActions =
    | GetLineItemBundleAction
    | GetLineItemBundleSucceededAction
    | GetLineItemBundleFailedAction
    | UpdateLineItemBundleAction
    | UpdateLineItemBundleSucceededAction
    | UpdateLineItemBundleFailedAction
    | ResetStoreAction;

  const lineItemBundleReducer: Reducer<
    LineItemBundleReducerState,
    LineItemBundleReducerActions
  > = (state = lineItemBundleDefaultState, action) => {
    if (action.feature === feature) {
      switch (action.type) {
        case lineItemBundleActionTypes.GET_LINEITEM_BUNDLE: {
          return {
            ...state,
            datum: null,
            requestInProgress: true,
          };
        }
        case lineItemBundleActionTypes.GET_LINEITEM_BUNDLE_SUCCEEDED: {
          return {
            ...state,
            datum: action.payload,
            requestInProgress: false,
          };
        }
        case lineItemBundleActionTypes.GET_LINEITEM_BUNDLE_FAILED: {
          return {
            ...state,
            error: action.payload.error,
            requestInProgress: false,
          };
        }
        case lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE: {
          return {
            ...state,
            datum: null,
            requestInProgress: true,
          };
        }
        case lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE_SUCCEEDED: {
          return {
            ...state,
            datum: action.payload,
            requestInProgress: false,
          };
        }
        case lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE_FAILED: {
          return {
            ...state,
            error: action.payload.error,
            requestInProgress: false,
          };
        }
        case lineItemBundleActionTypes.RESET_STORE: {
          return { ...lineItemBundleDefaultState };
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

  const getLineItemBundleEpic: Epic<
    GetLineItemBundleAction,
    any,
    any,
    any
  > = action$ => {
    return action$.pipe(
      ofFeatureAndType(feature, lineItemBundleActionTypes.GET_LINEITEM_BUNDLE),
      switchMap(action => {
        return ajax({
          url: getGateway(
            `/gateway/demand-line-items/line-items/${action.payload.id}`
          ),
          method: 'GET',
        }).pipe(
          map((attempt: CustomAjaxResponse<LineItemBundle>) =>
            lineItemBundleActionCreators.getLineItemBundleSucceeded(
              attempt.response
            )
          ),
          catchError((err, caught) =>
            of(lineItemBundleActionCreators.getLineItemBundleFailed(err))
          )
        );
      })
    );
  };

  const updateLineItemBundleEpic: Epic<
    UpdateLineItemBundleAction,
    any,
    any,
    any
  > = action$ => {
    return action$.pipe(
      ofFeatureAndType(feature, lineItemBundleActionTypes.UPDATE_LINEITEM_BUNDLE),
      switchMap(action => {
        return ajax({
          url: getGateway(
            `/gateway/demand-line-items/line-items/${action.payload.id}`
          ),
          method: 'PUT',
        }).pipe(
          map((attempt: CustomAjaxResponse<LineItemBundle>) =>
            lineItemBundleActionCreators.updateLineItemBundleSucceeded(
              attempt.response
            )
          ),
          catchError((err, caught) =>
            of(lineItemBundleActionCreators.updateLineItemBundleFailed(err))
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

  const mapIsLineItemBundleDuckStoreRegistered = (store: any) => {
    return _.get(store, featureName) !== undefined;
  };
  const useIsLineItemBundleDuckStoreRegistered = () => {
    return useMappedState(mapIsLineItemBundleDuckStoreRegistered);
  }

  const useResetStore = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
      return dispatch(lineItemBundleActionCreators.resetStore());
    }, []);
  }

  const useGetLineItemBundle = () => {
    const dispatch = useDispatch();
    return useCallback((id: string) => {
      return dispatch(lineItemBundleActionCreators.getLineItemBundle(id));
    }, []);
  };

  const useUpdateLineItemBundle = () => {
    const dispatch = useDispatch();
    return useCallback((bundleJson: LineItemBundleJson) => {
      return dispatch(lineItemBundleActionCreators.updateLineItemBundle(bundleJson));
    }, []);
  }

  const mapStateToProps = (store: any) => {
    const res: LineItemBundleReducerState | undefined = _.get(
      store,
      featureName
    );
    return res || lineItemBundleDefaultState;
  };

  const useLineItemBundle = () => {
    return useMappedState(mapStateToProps);
  };

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── BUNDLING ───────────────────────────────────────────────────────────────────
  //
  // ────────────────────────────────────────────────────────────────────────────────

  const lineItemBundleEpics = [getLineItemBundleEpic, updateLineItemBundleEpic];

  return {
    defaultState: lineItemBundleDefaultState,
    actionCreators: lineItemBundleActionCreators,
    epics: lineItemBundleEpics,
    reducers: lineItemBundleReducer,
    useIsLineItemBundleDuckStoreRegistered,
    useGetLineItemBundle,
    useUpdateLineItemBundle,
    useLineItemBundle,
    useResetStore,
  };
}
