import * as React from 'react';
import * as _ from 'lodash';

import { useDispatch, useMappedState } from 'redux-react-hook';

import { actions, DemandCampaignsState } from './core';

interface Store {
  demandCampaigns: {
    campaigns: DemandCampaignsState;
  };
}


const mapIsDemandCampaignsStoreRegistered = (store: any) => {
  return _.get(store, 'demandCampaigns') !== undefined;
}
export const useIsDemandCampaignsStoreRegistered = () => {
  return useMappedState(mapIsDemandCampaignsStoreRegistered);
}

const campaignsMapState = (store: Store) => {
  const demandCampaigns = store.demandCampaigns || {
    campaigns: { campaigns: [], lineItems: [] },
  };
  return {
    lastCreatedCampaign: demandCampaigns.campaigns.lastCreatedCampaign,
    campaigns: demandCampaigns.campaigns.campaigns,
    lastCreatedLineItem: demandCampaigns.campaigns.lastCreatedLineItem,
    lineItems: demandCampaigns.campaigns.lineItems,
    requestInProgress: demandCampaigns.campaigns.requestInProgress,
    request: demandCampaigns.campaigns.request,
  };
};

export const useDemandCampaignsState = () => {
  return useMappedState(campaignsMapState);
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── CAMPAIGNS ──────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export const useLastCreatedCampaign = () => {
  const { lastCreatedCampaign, requestInProgress, request } = useMappedState(
    campaignsMapState
  );
  return {
    lastCreatedCampaign,
    requestInProgress,
    request,
  };
};

export const useCampaigns = () => {
  return useMappedState(campaignsMapState).campaigns;
};

export const useCampaign = (campaignId: string) => {
  return useMappedState(campaignsMapState).campaigns.find(
    cmp => cmp.id === campaignId
  );
};

export const useCampaignRequestInProgress = () => {
  return useMappedState(campaignsMapState).requestInProgress;
};

export const useCampaignRequest = () => {
  return useMappedState(campaignsMapState).request;
};

export const useGetAllCampaigns = (id?: string) => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(actions.getAllCampaigns(id)), [id]);
};

export const useCreateCampaign = () => {
  const dispatch = useDispatch();

  return React.useCallback(
    campaign => dispatch(actions.createCampaign(campaign)),
    []
  );
};

export const useUpdateCampaign = (id: string) => {
  const dispatch = useDispatch();

  return React.useCallback(
    campaign => dispatch(actions.updateCampaign(campaign, id)),
    []
  );
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── LINE ITEMS ─────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export const useGetLineItem = () => {
  const dispatch = useDispatch();
  return React.useCallback(
    (id: string) => dispatch(actions.getLineItem(id)),
    []
  );
};

export const useGetAllLineItems = () => {
  const dispatch = useDispatch();

  return React.useCallback(
    (campaign_id: string) => dispatch(actions.getAllLineItems(campaign_id)),
    []
  );
};

export const useLineItem = (lineItemId: string = 'no_id') => {
  return useMappedState(campaignsMapState).lineItems.find(
    li => li.id === lineItemId
  );
};

export const useLineItems = () => {
  return useMappedState(campaignsMapState).lineItems;
};

export const useCreateLineItemBundle = () => {
  const dispatch = useDispatch();

  return React.useCallback(function(campaignId, bundle) {
    return dispatch(actions.createLineItemBundle(campaignId, bundle));
  }, []);
};

export const useLastCreatedLineItemBundle = () => {
  const { lastCreatedLineItem, requestInProgress, request } = useMappedState(
    campaignsMapState
  );
  return {
    lastCreatedLineItem,
    requestInProgress,
    request,
  };
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── COMMON ─────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export const useResetRequest = () => {
  const dispatch = useDispatch();
  return React.useCallback(() => {
    return dispatch(actions.resetRequest());
  }, []);
};

export const useRequestResetOnUnmount = () => {
  const resetRequest = useResetRequest();

  React.useEffect(() => {
    return () => {
      resetRequest();
    };
  }, []);
};
