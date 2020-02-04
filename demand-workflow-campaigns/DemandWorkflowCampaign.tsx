import * as _ from 'lodash';
import * as React from 'react';

import { BrandsSVC, CrownSVC } from 'olympus-anesidora';

import Content from '../shared/Areas/Content';
import AreaHeader from '../shared/Areas/Header';
import AreaMenu from '../shared/Areas/Menu';
import Title from '../shared/Areas/Title';

import { useCampaignForm } from '../demand/form';

import {
  actions as actionsDemand,
  useBrands,
  useGetAllBrands,
} from '../demand/core';

import {
  ApiCampaign,
  actions as actionsDemandCampaign,
  epics,
  reducers,
  useCampaigns,
  useGetAllCampaigns,
  useCampaignRequest,
  useUpdateCampaign,
  useCampaignRequestInProgress,
  useGetAllLineItems,
  useLineItems,
} from '../demand-campaigns/core';

import {
  useRegisterForStore,
  useValidation,
  useValidationPanel,
} from '../shared/use';

import { getDynamicPath } from '../shared/utils/paths';

import { useCampaignEdit } from '../demand-workflow/use';
import LineItemListing from './line-item-listing/LineItemListing';

import './DemandWorkflowCampaign.css';

interface Props {
  match: {
    params: {
      id: string;
    };
  };
  getAllBrands: typeof actionsDemand.getBrands;
  brandList: BrandsSVC.Brand[];

  getAllCampaigns: typeof actionsDemandCampaign.getAllCampaigns;
  campaignList: ApiCampaign[];

  getAllLineItems: typeof actionsDemandCampaign.getAllLineItems;
  lineItemList: CrownSVC.LineItem[];

  updateCampaign: typeof actionsDemandCampaign.updateCampaign;

  campaign_id: string;

  loading: React.ReactNode;
  requestInProgress: boolean;
  request: string;
}

function DemandWorkflowCampaigns({
  match = { params: { id: '' } },
  campaign_id = match.params.id,
  updateCampaign = useUpdateCampaign(campaign_id),
  brandList = useBrands(),
  getAllBrands = useGetAllBrands(),
  campaignList = useCampaigns(),
  getAllCampaigns = useGetAllCampaigns(campaign_id),
  lineItemList = useLineItems(),
  getAllLineItems = useGetAllLineItems(),
  requestInProgress = useCampaignRequestInProgress(),
  request = useCampaignRequest(),
}: Props) {
  const refEl = React.useRef(null);
  const {
    campaign: campaignForm,
    errors: campaignErrors,
    actions: campaignActions,
    formValidated,
    handlerCreateCampaign,
  } = useCampaignForm({
    refEl,
    createOrUpdateCampaign: updateCampaign,
    validationType: 'update',
  });
  const [campaign, setCampaign] = React.useState({} as ApiCampaign);
  const propsCampaignEdit = useCampaignEdit({
    brandList,
    campaignActions,
    campaignErrors,
    campaignForm,
    refEl,
    mode: 'update',
  });

  const validationPanel = useValidationPanel();
  const validationComponent = useValidation({
    handlerAction: handlerCreateCampaign,
    requestReady: formValidated,
    requestInProgress,
    request,
    texts: {
      fire: 'Update Campaign',
      succeeded: 'Campaign updated',
      failed: 'Campaign not updated',
    },
  });

  React.useEffect(() => {
    const campaignBrands = _.chain(campaign.brands)
      .map((uuid: string) => {
        const brand = _.find(brandList, brand => brand.meta_id === uuid);

        if (!brand) {
          return null;
        }

        return {
          datum: brand,
          id: uuid,
          label: brand.name,
        };
      })
      .compact()
      .value();

    campaignActions.update({
      name: campaign.name,
      global_budget: campaign.global_budget,
    });

    if (campaignBrands.length >= 1) {
      propsCampaignEdit.setSelectCountry(campaign.country);
      // Hacky way of ensurinr brands are being displayed
      setTimeout(() => {
        propsCampaignEdit.setSelectedBrands(campaignBrands);
        validationPanel.closeValidationPanel();
      }, 1);
    }
  }, [campaign, brandList]);

  React.useEffect(() => {
    getAllBrands();
    getAllCampaigns();
    getAllLineItems(campaign_id);
  }, []);

  React.useEffect(() => {
    if (_.isArray(campaignList) && campaignList.length > 0) {
      const [currentCampaign] = campaignList;

      setCampaign(currentCampaign);
    }
  }, [campaignList]);

  useRegisterForStore({ epics, reducers, identifier: 'demandCampaigns' });

  function children() {
    const title = campaign.name ? campaign.name : 'Campaign';

    return (
      <>
        <Title>{title}</Title>
        {propsCampaignEdit.renderCampaignEdit()}
        <LineItemListing
          campaign_id={campaign_id}
          lineItemList={lineItemList}
        />
      </>
    );
  }

  function headerChildren() {
    return (
      <AreaHeader>
        <AreaHeader.Right>
          <AreaMenu>
            <AreaMenu.Item
              path={getDynamicPath('demand.workflow.campaign', {
                id: campaign_id,
              })}
            >
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
        contentClass="demand-workflow-campaigns"
        contentChildren={children}
        headerChildren={headerChildren}
        validationChildren={validationComponent}
      />
    </div>
  );
}

export default DemandWorkflowCampaigns;
