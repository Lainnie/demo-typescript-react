import { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { brandProductsGroupedByShelvesReducerActions, brandProductsGroupedByShelvesReducerDefaultState } from './core';
import { AthenaStore } from 'shared/store';

export const useGetBrandProductsByShelves = () => {
  const dispatch = useDispatch();
  return useCallback((brandId: string) => {
    return dispatch(brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelves(brandId));
  }, []);
};

const mapStateToProps = (store: AthenaStore) => {
  if (store && store.demandAdministration && store.demandAdministration.brandProductsGroupedByShelves) {
    return store.demandAdministration.brandProductsGroupedByShelves;
  }
  return brandProductsGroupedByShelvesReducerDefaultState;
};

export const useBrandProductsByShelves = () => {
  return useMappedState(mapStateToProps);
}