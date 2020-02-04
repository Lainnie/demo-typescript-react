import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Content from '../shared/Areas/Content';
import AreaHeader from '../shared/Areas/Header';
import AreaMenu from '../shared/Areas/Menu';
import Title from '../shared/Areas/Title';
import { useRegisterForStore, useValidation } from '../shared/use';
import { useBrands, useGetAllBrands } from '../demand/core';
import { useCampaignForm } from '../demand/form';
import CampaignEdit from '../demand-workflow/CampaignEdit';
import {
  actions as actionsDemandCampaign,
  epics,
  reducers,
  ApiCampaign,
  useLastCreatedCampaign,
  useRequestResetOnUnmount as useDemandCampaignsRequestResetOnUnmount,
} from '../demand-campaigns/core';
import LineItemListing from './LineItemListing';
import { getDynamicPath } from '../shared/utils/paths';
import './DemandNewCampaign.css';

interface Props extends RouteComponentProps {
  createCampaign: typeof actionsDemandCampaign.createCampaign;
  loading: React.ReactNode;
}

const DemandNewCampaign = ({ history, createCampaign }: Props) => {
  const brandList = useBrands();
  const getAllBrands = useGetAllBrands();
  const {
    request,
    requestInProgress,
    lastCreatedCampaign,
  } = useLastCreatedCampaign();

  const refEl = React.useRef(null);
  const {
    campaign: campaignForm,
    errors: campaignErrors,
    actions: campaignActions,
    formValidated,
    handlerCreateCampaign,
  } = useCampaignForm({
    refEl,
    createOrUpdateCampaign: createCampaign,
  });

  const onRequestSuccessFunc = (data: ApiCampaign | null) => {
    _.delay(
      lastCreatedCampaignId => {
        history.push(
          getDynamicPath('demand.workflow.campaign', lastCreatedCampaignId)
        );
      },
      2000,
      { id: data!.id }
    );
  };

  const validationComponent = useValidation({
    handlerAction: handlerCreateCampaign,
    request,
    requestInProgress,
    requestReady: formValidated,
    texts: {
      fire: 'Create Campaign',
      succeeded: 'Campaign saved',
      failed: 'Campaign not saved',
    },
    messages: {
      succeeded: 'You will be redirected to your campaign shortly',
      failed: 'The creation failed',
    },
    onRequestSuccess: [onRequestSuccessFunc, lastCreatedCampaign],
  });

  useRegisterForStore({ epics, reducers, identifier: 'demandCampaigns' });

  useDemandCampaignsRequestResetOnUnmount();

  React.useEffect(() => {
    getAllBrands();
  }, []);

  function children() {
    const title = campaignForm.name
      ? `New Campaign - ${campaignForm.name}`
      : 'New Campaign';

    return (
      <>
        <Title>{title}</Title>
        <CampaignEdit
          brandList={brandList}
          campaignActions={campaignActions}
          campaignForm={campaignForm}
          campaignErrors={campaignErrors}
          refEl={refEl}
        />
        <LineItemListing campaign={campaignForm} />
      </>
    );
  }

  function headerChildren() {
    return (
      <AreaHeader>
        <AreaHeader.Right>
          <AreaMenu>
            <AreaMenu.Item path="/demand/workflow/campaigns/new">
              General
            </AreaMenu.Item>
            <AreaMenu.Item>Reports</AreaMenu.Item>
          </AreaMenu>
        </AreaHeader.Right>
      </AreaHeader>
    );
  }

  return (
    <div className="full-height" ref={refEl}>
      <Content
        contentClass="demand-new-campaign"
        contentChildren={children}
        headerChildren={headerChildren}
        validationChildren={validationComponent}
      />
    </div>
  );
};

export default DemandNewCampaign;
