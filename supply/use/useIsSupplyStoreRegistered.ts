import * as _ from 'lodash';
import { useMappedState } from 'redux-react-hook';

const mapIsSupplyStoreRegistered = (store: any) => {
  return _.get(store, 'supply') !== undefined;
};

export const useIsSupplyStoreRegistered = () => {
  return useMappedState(mapIsSupplyStoreRegistered);
}