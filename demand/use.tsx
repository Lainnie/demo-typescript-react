import * as React from 'react';

import { useDispatch, useMappedState } from 'redux-react-hook';

import { actions, MainState } from './core';

interface Store {
  demand: {
    main: MainState;
  };
}

const brandsMapState = (store: Store) => ({
  brands: store.demand.main.brands,
});

export const useBrands = () => {
  return useMappedState(brandsMapState).brands;
};

export const useGetAllBrands = () => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(actions.getBrands()), []);
};
