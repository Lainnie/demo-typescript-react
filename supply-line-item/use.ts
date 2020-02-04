import * as React from 'react';

import { useDispatch, useMappedState } from 'redux-react-hook';

import { actions, SupplyLineItemsState } from './core';

interface Store {
  supplyLineItems: {
    lineItems: SupplyLineItemsState;
  };
}

const lineItemsMapState = (store: Store) => {
  const supplyLineItems = store.supplyLineItems || {
    lineItems: { lineItems: [] },
  };
  return {
    lineItems: supplyLineItems.lineItems,
  };
};

export const useLineItems = () => {
  return useMappedState(lineItemsMapState).lineItems;
};

export const useGetAllLineItems = () => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(actions.getLineItems()), []);
};
