import * as _ from 'lodash';
import * as React from 'react';
import { RiseSVC, MeccaSVC } from 'olympus-anesidora';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import { Body } from '../shared/Typography';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import { useRetailerHeader } from '../supply/core';
import { useRedirect, useRegisterForStore } from '../shared/use';
import { getPath } from '../shared/utils/paths';
import {
  useGetCategoriesAndGroups,
  useCategoriesAndGroups,
  CategoriesAndGroupsRawData,
} from './use';
import { epics, reducers } from './core';
import { getCategoryIdsAndGroupIdsFromRetailers } from './utils';

import './SupplyAdministration.css';

interface Props {
  retailers: string[];
  some: string;
  and: boolean;
}

const SupplyAdministration = (props: Props) => {
  const { currentRetailer, Header, retailerList } = useRetailerHeader();
  const [redirect, setRedirect] = useRedirect();
  const categoriesAndGroups: CategoriesAndGroupsRawData = useCategoriesAndGroups();
  const getCategoriesAndGroups = useGetCategoriesAndGroups();
  const [currentRetailerDetails, setCurrentRetailerDetails] = React.useState<{
    groupName: string;
    categories: MeccaSVC.Shelf[];
  }>({
    groupName: '--',
    categories: [],
  });

  React.useEffect(() => {
    useRegisterForStore({
      epics,
      identifier: 'supplyAdministration',
      reducers,
    });
  }, []);

  React.useEffect(() => {
    if (retailerList && retailerList.length) {
      const categoryIdsAndGroupIds = getCategoryIdsAndGroupIdsFromRetailers(
        retailerList
      );
      getCategoriesAndGroups(categoryIdsAndGroupIds);
    }

    return () => {};
  }, [retailerList]);

  // 1 - Get/set currentRetailer categories & groups on categoriesAndGroups change/init
  // 2 - Get/set newly selected retailer categories and group
  React.useEffect(() => {
    if (categoriesAndGroups) {
      const group = categoriesAndGroups.groups.find(
        group => group.id === currentRetailer.group_id
      );
      const categories = categoriesAndGroups.categories.filter(cat =>
        _.includes(currentRetailer.categories, cat.id)
      );

      setCurrentRetailerDetails({
        groupName: group ? group.name : '--',
        categories,
      });
    }
  }, [categoriesAndGroups, currentRetailer]);

  function children(childrenProps: Props) {
    const retailer: Partial<RiseSVC.Retailer> = currentRetailer.id
      ? currentRetailer
      : { name: '--' };
    const title = currentRetailer.id
      ? `Administration - ${currentRetailer.name}`
      : 'Administration';

    return (
      <React.Fragment>
        <Title>{title}</Title>
        <demeter-container
          class="container-general"
          label="General informations"
        >
          <div className="grid-content" slot="">
            {categoriesAndGroups ? (
              <React.Fragment>
                <div className="column-1-3">
                  <Body>Retailer name:</Body>
                  <Body mode="bold">{retailer.name}</Body>
                </div>
                <div className="column-3-5">
                  <Body>Retailer category:</Body>
                  <Body mode="bold">
                    {currentRetailerDetails.categories.length
                      ? currentRetailerDetails.categories
                          .map(cat => cat.name)
                          .join(' - ')
                      : '--'}
                  </Body>
                </div>
                <div className="column-5-7">
                  <Body>Currency:</Body>
                  <Body mode="bold">{currentRetailer.currency}</Body>
                </div>
                <div className="column-1-3">
                  <Body>Group:</Body>
                  <Body mode="bold">{currentRetailerDetails.groupName}</Body>
                </div>
                <div className="column-3-5">
                  <Body>Country:</Body>
                  <Body mode="bold">{currentRetailer.country}</Body>
                </div>
                <div className="column-5-7">
                  <Body>Language:</Body>
                  <Body mode="bold">{currentRetailer.language}</Body>
                </div>
              </React.Fragment>
            ) : (
              <div className="column-1-7 productsAndShelvesSpinnerContainer">
                <demeter-global-spinner color="grey-gradient" />
              </div>
            )}
          </div>
        </demeter-container>
        <demeter-container class="column-1-3" label="Zones">
          <div className="link" slot="">
            <Body>
              Define the zones of your website you want to modelize, and allowed
              types of deal.
            </Body>
            <demeter-button
              mode="secondary"
              onClick={() => {
                setRedirect(getPath('supply.administration.zones'));
              }}
            >
              Define Zones
            </demeter-button>
          </div>
        </demeter-container>
        <demeter-container class="column-3-5" label="Formats">
          <div className="link" slot="">
            <Body>Define the formats on each zone.</Body>
            <demeter-button
              mode="secondary"
              onClick={() => {
                setRedirect(getPath('supply.administration.formats'));
              }}
            >
              Define Formats
            </demeter-button>
          </div>
        </demeter-container>
        <demeter-container class="column-5-7" label="Inventory prices">
          <div className="link" slot="">
            <Body>
              Define inventory prices per zones and per formats.
              <br />
              Status: default values are currently set.
            </Body>
            <demeter-button
              mode="secondary"
              onClick={() => {
                setRedirect(getPath('supply.administration.inventoryPrices'));
              }}
            >
              Define Inventory Prices
            </demeter-button>
          </div>
        </demeter-container>
        {redirect}
      </React.Fragment>
    );
  }

  function headerChildren(headerProps: Props) {
    return <Header />;
  }

  function validationChildren(validationProps: Props) {
    return <div>validation</div>;
  }

  return (
    <AthenaDocumentTitle pageName="Supply Administration">
      <Content
        {...props}
        contentClass="supply-administration"
        contentChildren={children}
        headerChildren={headerChildren}
        validationChildren={validationChildren}
      />
    </AthenaDocumentTitle>
  );
};

export default SupplyAdministration;
