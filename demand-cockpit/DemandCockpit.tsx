import * as _ from 'lodash';
import * as React from 'react';
import { BrandsSVC } from 'olympus-anesidora';

import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import { useEvent, useRedirect, useRegisterForStore } from '../shared/use';
import AreaHeader from '../shared/Areas/Header';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../shared/Dropdown';

import { useBrands, useGetAllBrands } from '../demand/core';
import { useCurrentUser, useBusinessEntity } from '../authent/core';

import { getPath } from '../shared/utils/paths';

import { reducers } from './core';

import demandAgencyCockpitMockup from './mockups/demandAgency';
import demandBrandCockpitMockup from './mockups/demandBrand';
import demandRetailerCockpitMockup from './mockups/demandRetailer';
import demandSalesHouseCockpitMockup from './mockups/demandSalesHouse';

const getCockpitMockup = (businessEntity?: string) => {
  switch (businessEntity) {
    case 'agency':
      return demandAgencyCockpitMockup;
    case 'brand':
      return demandBrandCockpitMockup;
    case 'retailer':
      return demandRetailerCockpitMockup;
    case 'sales_house':
      return demandSalesHouseCockpitMockup;
    default:
      return demandAgencyCockpitMockup;
  }
};

function DemandCockpit({
  brandList = useBrands(),
  getAllBrands = useGetAllBrands(),
  user = useCurrentUser(),
  businessEntity = useBusinessEntity(),
}) {
  const $el = React.useRef(null);
  const [redirect, setRedirect] = useRedirect();
  const [currentBrand, setCurrentBrand] = React.useState(
    {} as DropdownItemBaseProps<BrandsSVC.Brand>
  );

  useRegisterForStore({
    reducers,
    identifier: 'demandCockpit',
  });

  React.useEffect(() => {
    getAllBrands();
  }, []);

  useEvent({
    onHandler: onDemeterClick,
    refEl: $el,
  });

  function getBrandDropdownList(brandList: BrandsSVC.Brand[]) {
    const brandDropdownList = _.map(brandList, brand => ({
      datum: brand,
      id: brand.meta_id,
      label: brand.name,
    }));
    return brandDropdownList;
  }

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
            noValueMessage="Select a brand"
            itemList={getBrandDropdownList(brandList)}
            loadingMessage="Loading your brands..."
            onChange={brand => setCurrentBrand(brand)}
          />
        </AreaHeader.Left>
        <AreaHeader.Right>
          <demeter-button size="M" mode="primary" identifier="new-campaign">
            New Campaign
          </demeter-button>
        </AreaHeader.Right>
        {redirect}
      </AreaHeader>
    );
  }

  return (
    <AthenaDocumentTitle pageName="Demand Cockpit">
      <div className="full-height" ref={$el}>
        <Content
          headerChildren={headerChildren}
          contentClass="demand-cockpit"
          contentChildren={() => (
            <>
              <Title>
                Welcome {user.firstname} {user.lastname}
              </Title>
              <img
                src={getCockpitMockup(businessEntity)}
                alt={`cockpit ${businessEntity}`}
              />
            </>
          )}
        />
      </div>
    </AthenaDocumentTitle>
  );
}

export default DemandCockpit;
