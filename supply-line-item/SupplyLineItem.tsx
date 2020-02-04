import * as _ from 'lodash';
import * as React from 'react';

import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import { useRegisterForStore } from '../shared/use';
import { useGetAllRetailers, useRetailers } from '../supply/use/useRetailers';
import { useRetailerHeader } from '../supply/core';
import {
  epics,
  reducers,
  useGetAllLineItems,
  useLineItems,
} from '../supply-line-item/core';

import { SupplyLineItemOverview } from './overview/SupplyLineItemOverview';
import { SupplyLineItemListing } from './listing/SupplyLineItemListing';

import './SupplyLineItem.css';

interface Props {
  children: any;
}

const SupplyLineItem = (props: Props) => {
  const refEl = React.useRef(null);
  const getAllRetailers = useGetAllRetailers();
  const retailerList = useRetailers();
  const { currentRetailer, Header } = useRetailerHeader(true);
  const lineItemsList = useLineItems();
  const getLineItems = useGetAllLineItems();
  const lineItemsListFilter = _.filter(lineItemsList.lineItems, datum => {
    return (datum.retailer_id === currentRetailer.id) || (currentRetailer.id === '0'); // id: '0' for all retailers
  });

  useRegisterForStore({
    epics,
    identifier: 'supplyLineItems',
    reducers,
  });
  React.useEffect(() => {
    getLineItems();
  }, []);

  const children = (childrenProps: Props) => {
    return (
      <React.Fragment>
        <div id="container-title" className="column-1-7">
          <Title>
            Live Campaigns on {currentRetailer.name ? currentRetailer.name : ''}{' '}
          </Title>
        </div>
        <SupplyLineItemOverview lineItemRetailers={lineItemsListFilter} />
        <SupplyLineItemListing
          lineItemRetailers={lineItemsListFilter}
          retailerList={retailerList}
        />
      </React.Fragment>
    );
  };

  const headerChildren = (headerProps: Props) => <Header rightMenu={false} />;

  const validationChildren = (validationProps: Props) => (
    <div className="inner-validation">validation</div>
  );

  return (
    <AthenaDocumentTitle pageName="Supply Zones">
      <div ref={refEl} className="full-height">
        <Content
          contentClass="supplyzones"
          contentChildren={children}
          headerChildren={headerChildren}
          validationChildren={validationChildren}
        />
      </div>
    </AthenaDocumentTitle>
  );
};

export default SupplyLineItem;
