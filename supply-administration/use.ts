import { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { categoriesAndGroupsReducerActions, categoriesAndGroupsReducerDefaultState, SupplyAdministrationReducerState } from './core';

export const useGetCategoriesAndGroups = () => {
  const dispatch = useDispatch();
  return useCallback(({ categoryIds, groupIds }: { categoryIds: string[], groupIds: string[]}) => {
    return dispatch(categoriesAndGroupsReducerActions.getCategoriesAndGroups({ categoryIds, groupIds }));
  }, []);
};

const mapStoreToProps = (store:{ supplyAdministration: SupplyAdministrationReducerState }) => {
  if (store && store.supplyAdministration && store.supplyAdministration.categoriesAndGroups && store.supplyAdministration.categoriesAndGroups.data) {
    return store.supplyAdministration.categoriesAndGroups.data
  }
  return categoriesAndGroupsReducerDefaultState.data;
};

export type CategoriesAndGroupsRawData = ReturnType<typeof mapStoreToProps>;

type TransformFunc = (rawData: CategoriesAndGroupsRawData) => any;


export const useCategoriesAndGroups = (transform: TransformFunc|null = null) => {
  if (transform) {
    return transform(useMappedState(mapStoreToProps));
  }
  return useMappedState(mapStoreToProps);
}