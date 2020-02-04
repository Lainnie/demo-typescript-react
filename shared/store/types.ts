import { DemandAdministrationReducerState } from '../../demand-administration/core';
import { DemandCampaignsState } from '../../demand-campaigns/core';

export interface AthenaAction<P, T> {
  payload: P;
  type: T;
}

export interface AthenaStore {
  demandAdministration: DemandAdministrationReducerState;
  demandCampaigns: DemandCampaignsState;
}
