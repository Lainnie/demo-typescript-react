import * as React from 'react';

import { useDispatch, useMappedState } from 'redux-react-hook';

import { actions, SupplyZonesState } from './core';

interface Store {
  supplyZones: {
    zones: SupplyZonesState;
  };
}

const zonesMapState = (store: Store) => {
  const supplyZones = store.supplyZones || {
    zones: { zones: [] },
  };
  return {
    zones: supplyZones.zones.zones,
  };
};

export const useZones = () => {
  return useMappedState(zonesMapState).zones;
};

export const useGetAllZones = () => {
  const dispatch = useDispatch();
  return React.useCallback(() => dispatch(actions.getZones()), []);
};

export const useUpdateZone = () => {
  const dispatch = useDispatch();
  return React.useCallback(zone => dispatch(actions.updateZone(zone)), []);
};

export const useUpdateZones = () => {
  const dispatch = useDispatch();
  return React.useCallback(zones => dispatch(actions.updateZones(zones)), []);
};

export const useCreateZonesPrices = () => {
  const dispatch = useDispatch();
  return React.useCallback(
    payload => dispatch(actions.createZonesPrices(payload)),
    []
  );
};
