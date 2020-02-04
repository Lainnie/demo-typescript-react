import * as React from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import * as _ from 'lodash';

import { actions, MainState } from '../core';

interface Store {
  supply: {
    main: MainState;
  };
}

const retailersMapState = (store: Store) => ({
  retailers: _.get(store, 'supply.main.retailers') || [],
});

export const useRetailers = () => {
  return useMappedState(retailersMapState).retailers;
};

export const useGetAllRetailers = () => {
  const dispatch = useDispatch();
  return React.useCallback(() => dispatch(actions.getRetailers()), []);
};

export const useUpdateRetailers = () => {
  const dispatch = useDispatch();
  return React.useCallback(
    retailers => dispatch(actions.updateRetailers(retailers)),
    []
  );
};
