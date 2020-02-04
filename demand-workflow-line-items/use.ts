import { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import * as _ from 'lodash';
import {
  actionCreators,
  DemandWorkflowLineItemStorePortion,
  mProductsDefaultState,
  MProductsReducerState,
} from './core';
import {
  lineItemBundle as lineItemBundleDuckling,
  zones as zonesDuckling,
  formats as formatsDuckling,
 } from './ducklings';
import { useRetailers } from '../supply/use';

const mapIsDemandWorkflowLineItemStoreRegistered = (store: any) => {
  return _.get(store, 'demandWorkflowLineItem') !== undefined;
}

export const useIsDemandWorkflowLineItemStoreRegistered = () => {
  return useMappedState(mapIsDemandWorkflowLineItemStoreRegistered);
}

export const useGetAllMProducts = () => {
  const dispatch = useDispatch();
  return useCallback((brandId: string) => {
    return dispatch(actionCreators.getMProducts(brandId));
  }, []);
};


const mapStateToProps = (store: DemandWorkflowLineItemStorePortion) => {
  const res:MProductsReducerState|undefined = _.get(store, 'demandWorkflowLineItem.mProducts');
  return res || mProductsDefaultState;
};

export const useMProducts = () => {
  return useMappedState(mapStateToProps);
};
