import * as _ from 'lodash';
import * as React from 'react';
import { RiseSVC } from 'olympus-anesidora';

import { ContextRetailer } from './ContextRetailer';
import { useGetAllRetailers, useRetailers } from './useRetailers';

import AreaHeader from '../../shared/Areas/Header';
import AreaMenu from '../../shared/Areas/Menu';

import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../../shared/Dropdown';

export function useRetailerHeader(allOptionEnabled: boolean = false) {
  const {
    getRetailerList,
    onRetailerChange,
    retailerPlaceholder,
    contextRetailerState,
    retailerList,
  } = useSelectRetailer(allOptionEnabled);

  const itemList = getRetailerList();

  return {
    Header: ({ rightMenu = true }) => (
      <AreaHeader>
        <AreaHeader.Left>
          <Dropdown
            identifier="currentRetailer"
            mode={DropdownAttrMode.MENU}
            label="Retailer"
            disabled={false}
            style={{ width: '10em' }}
            value={
              (contextRetailerState.retailer &&
                contextRetailerState.retailer.id) ||
              undefined
            }
            noValueMessage="All retailers"
            itemList={itemList}
            loading={!itemList || itemList.length < 1}
            loadingMessage="Loading retailers"
            onChange={onRetailerChange}
          />
        </AreaHeader.Left>
        {rightMenu ? (
          <AreaHeader.Right>
            <AreaMenu>
              <AreaMenu.Item path="/supply/administration">
                Administration
              </AreaMenu.Item>
              <AreaMenu.Item path="/supply/administration/zones">
                Zones
              </AreaMenu.Item>
              <AreaMenu.Item path="/supply/administration/formats">
                Formats
              </AreaMenu.Item>
              <AreaMenu.Item path="/supply/administration/inventory-prices">
                Inventory prices
              </AreaMenu.Item>
            </AreaMenu>
          </AreaHeader.Right>
        ) : null}
      </AreaHeader>
    ),
    currentRetailer: contextRetailerState.retailer,
    getRetailerList,
    onRetailerChange,
    retailerPlaceholder,
    retailerList,
  };
}

export function RetailerHeader() {
  const { Header } = useRetailerHeader(true);

  return <Header />;
}

export function useSelectRetailer(allOptionEnabled: boolean) {
  const getAllRetailers = useGetAllRetailers();
  const retailerList = useRetailers();
  const retailerPlaceholder = '#select-a-retailer';
  const { contextRetailerState, contextRetailerDispatch } = React.useContext(
    ContextRetailer
  );
  const setContextRetailer = (retailer: any) =>
    contextRetailerDispatch({ type: 'set-retailer', payload: retailer });

  React.useEffect(() => {
    getAllRetailers();
  }, []);

  React.useEffect(
    () => {
      if (allOptionEnabled) {
        setContextRetailer({ id: '0', label: 'All Retailers', datum: {} });
      } else if (
        retailerList.length !== 0 &&
        (!contextRetailerState.retailer.id ||
          contextRetailerState.retailer.id === '0')
      ) {
        setContextRetailer(retailerList[0]);
      }
    },
    [retailerList]
  );

  function getRetailerDropdownList() {
    const allOption: any = { id: '0', label: 'All', datum: {} };
    const retailerDropdownList = _.map(retailerList, retailer => {
      return {
        datum: retailer,
        id: retailer.id,
        label: retailer.name,
      };
    });

    return allOptionEnabled
      ? [allOption, ...retailerDropdownList]
      : retailerDropdownList;
  }

  function onRetailerChange(retailerDropdownItem: any) {
    setContextRetailer(retailerDropdownItem.datum);
  }

  return {
    getRetailerList: getRetailerDropdownList,
    onRetailerChange,
    retailerPlaceholder,
    contextRetailerState,
    retailerList,
  };
}
