import * as _ from 'lodash';
import * as React from 'react';
import { BrandsSVC } from 'olympus-anesidora';
import * as numeral from 'numeral';
import './DemandCampaigns.css';

import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../shared/Dropdown';

import Content from '../shared/Areas/Content';
import AreaHeader from '../shared/Areas/Header';
import Title from '../shared/Areas/Title';

import { getPath, getDynamicPath } from '../shared/utils/paths';

import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';

import { Gridata, GridOptions, ContentAlign } from '../gridata';
import { LinkCell } from '../gridata/cells';
import { DataTable } from '../gridata/DataTable';

import { useEvent, useRedirect, useRegisterForStore } from '../shared/use';

import {
  actions as actionsDemand,
  useBrands,
  useGetAllBrands,
} from '../demand/core';
import {
  ApiCampaign,
  actions,
  epics,
  reducers,
  useCampaigns,
  useGetAllCampaigns,
} from './core';

interface DemandCampaignList extends ApiCampaign {
  brand_names: string;
}

interface Props {
  getAllBrands: typeof actionsDemand.getBrands;
  brandList: BrandsSVC.Brand[];

  getAllCampaigns: typeof actions.getAllCampaigns;
  campaignList: ApiCampaign[];

  loading: React.ReactNode;
}

const DemandCampaigns = ({
  brandList = useBrands(),
  campaignList = useCampaigns(),
  getAllBrands = useGetAllBrands(),
  getAllCampaigns = useGetAllCampaigns(),
}: Props) => {
  const [currentBrand, setCurrentBrand] = React.useState(
    {} as DropdownItemBaseProps<BrandsSVC.Brand>
  );

  const onGridReady = React.useCallback(
    (params: Gridata<DemandCampaignList>) => {
      setGridata(params);
    },
    []
  );

  const [gridOptions, setGridOptions] = React.useState({
    columnDefs: [
      {
        field: 'name',
        headerName: 'Campaign Name',
        cellRenderer: (props: any) => (
          <LinkCell
            {...props}
            path={(original: DemandCampaignList) =>
              getDynamicPath('demand.workflow.campaign', { id: original.id })
            }
          />
        ),
      },
      {
        field: 'global_budget',
        headerName: 'Global Budget',
        contentAlign: ContentAlign.RIGHT,
      },
      { field: 'country', headerName: 'Country' },
      { field: 'brand_names', headerName: 'Brands' },
    ],
    onGridReady,
  } as GridOptions<DemandCampaignList>);

  const [gridata, setGridata] = React.useState({} as Gridata<
    DemandCampaignList
  >);

  const [redirect, setRedirect] = useRedirect();
  const $el = React.useRef(null);

  React.useEffect(() => {
    // @ts-ignore: damn ts
    setGridOptions({
      ...gridOptions,
      rawData: getCampaignList().map(campaign => ({
        ...campaign,
        global_budget: numeral(campaign.global_budget).format('$0,0.00')
      })),
    });
  }, [campaignList, brandList, currentBrand]);

  React.useEffect(() => {
    /* eslint-disable */ gridata; /* eslint-enable */
    getAllCampaigns();
    getAllBrands();
  }, []);

  useRegisterForStore({
    epics,
    identifier: 'demandCampaigns',
    reducers,
  });

  useEvent({
    onHandler: onDemeterClick,
    refEl: $el,
  });

  function onDemeterClick(event: CustomEvent) {
    const identifier = event.detail.identifier;

    switch (identifier) {
      case 'new-campaign':
        setRedirect(getPath('demand.workflow.newCampaign'));
        break;
      default:
        break;
    }
  }

  function onBrandChange(brand: DropdownItemBaseProps<BrandsSVC.Brand>) {
    setCurrentBrand(brand);
  }

  function getCampaignList() {
    return _.chain(campaignList)
      .filter(campaign => {
        if (!currentBrand.id || currentBrand === undefined) {
          return true;
        }

        return _.includes(campaign.brands, currentBrand.id);
      })
      .map(campaign => {
        const brands = _.filter(brandList, brand =>
          _.includes(campaign.brands, brand.meta_id)
        );

        return {
          ...campaign,
          brand_names: _.chain(brands)
            .map(brand => brand.name)
            .join(', ')
            .value(),
        };
      })
      .value();
  }

  function getBrandList() {
    const brandDropdownList = _.map(brandList, brand => ({
      datum: brand,
      id: brand.meta_id,
      label: brand.name,
    }));

    return [
      {
        datum: {} as BrandsSVC.Brand,
        id: '',
        label: 'All Brands',
      },
      ...brandDropdownList,
    ];
  }

  function children() {
    const title = currentBrand.id
      ? `Campaign List - ${currentBrand.label}`
      : 'Campaign List';

    return (
      <>
        <Title>{title}</Title>
        <demeter-container class="container-general">
          <DataTable gridOptions={gridOptions} />
        </demeter-container>
      </>
    );
  }

  function headerChildren() {
    return (
      <AreaHeader>
        <AreaHeader.Left>
          <Dropdown<BrandsSVC.Brand>
            identifier="currentBrand"
            mode={DropdownAttrMode.MENU}
            label="Brand"
            disabled={false}
            value={(currentBrand && currentBrand.id) || undefined}
            noValueMessage="All brands"
            itemList={getBrandList()}
            loadingMessage="Loading your brands..."
            onChange={onBrandChange}
          />
        </AreaHeader.Left>
        <AreaHeader.Right>
          <demeter-button size="M" mode="secondary" identifier="new-campaign">
            New Campaign
          </demeter-button>
        </AreaHeader.Right>
      </AreaHeader>
    );
  }

  function validationChildren() {
    return <div>validation</div>;
  }

  return (
    <div className="full-height" ref={$el}>
      <AthenaDocumentTitle pageName="Demand Campaigns">
        <>
          <Content
            contentClass="demand-campaigns"
            contentChildren={children}
            headerChildren={headerChildren}
            validationChildren={validationChildren}
          />
          {redirect}
        </>
      </AthenaDocumentTitle>
    </div>
  );
};

export default DemandCampaigns;
