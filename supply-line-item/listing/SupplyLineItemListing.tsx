import * as _ from 'lodash';
import * as React from 'react';
import * as numeral from 'numeral';
import { RiseSVC } from 'olympus-anesidora';
import AthenaDocumentTitle from '../../shared/components/AthenaDocumentTitle';
import { DataTable } from '../../gridata/DataTable';
import { ActionCell } from '../../gridata/cells';
import { percentageFormat, currencyFormat } from '../utils';
import { ContentAlign } from '../../gridata';

export const SupplyLineItemListing = ({
  lineItemRetailers,
  retailerList,
}: {
  lineItemRetailers: any;
  retailerList: RiseSVC.Retailer[];
}) => {
  const dummyDatum = _.map(lineItemRetailers, datum => {
    const retailerData = _.filter(retailerList, retailerDatum => {
      return retailerDatum.id === datum.retailer_id;
    });
    const name =
      retailerData[0].name && datum.line_item.name
        ? `${retailerData[0].name} - ${datum.line_item.name}`
        : '';
    const spent =
      datum.line_item.budget -
      datum.line_item.budget * (datum.line_item.progress / 100);
    const consumed =
      spent === 0 || datum.line_item.budget === 0
        ? 0
        : spent / datum.line_item.budget;
    return {
      name,
      brands: datum.line_item.brands,
      imp: numeral(datum.line_item.imp).format('0,0'),
      interactions: numeral(datum.line_item.interactions / 100).format(
        percentageFormat
      ),
      progress: numeral(datum.line_item.progress / 100).format(
        percentageFormat
      ),
      estimate: numeral(datum.line_item.budget).format(currencyFormat),
      spent: numeral(spent).format(currencyFormat),
      consumed: numeral(consumed).format(percentageFormat),
      action: { label: 'Pause the campaign', id: datum.line_item.id },
    };
  });

  const gridOptions: any = {
    columnDefs: [
      {
        field: 'name',
        headerName: 'Name',
        width: 'large',
      },
      {
        field: 'brands',
        headerName: 'Brands',
      },
      {
        field: 'imp',
        headerName: 'Imp',
        contentAlign: ContentAlign.RIGHT,
      },
      {
        field: 'interactions',
        headerName: 'Interactions rate',
        contentAlign: ContentAlign.RIGHT,
      },
      {
        field: 'progress',
        headerName: 'Progress rate',
        contentAlign: ContentAlign.RIGHT,
      },
      {
        field: 'estimate',
        headerName: 'Estimated BB',
        contentAlign: ContentAlign.RIGHT,
      },
      {
        field: 'spent',
        headerName: 'Spent budget',
        contentAlign: ContentAlign.RIGHT,
      },
      {
        field: 'consumed',
        headerName: 'Consumed %',
        contentAlign: ContentAlign.RIGHT,
      },
      {
        field: 'action',
        headerName: 'Actions',
        cellRenderer: (props: any) => (
          <ActionCell onclick={onClickAction} {...props} />
        ),
      },
    ],
    contextMenuDefs: [{ text: 'contextMenu Text' }],
    onGridReady: () => {
      return;
    },
    rawData: dummyDatum,
  };

  const onClickAction = (id: string) => {};

  return (
    <AthenaDocumentTitle pageName="Line Item">
      <demeter-container
        bodypadding={false}
        class="container-general"
        label="Campaing listing"
      >
        <p style={{ marginLeft: '1em' }} />
        <DataTable gridOptions={gridOptions} />
      </demeter-container>
    </AthenaDocumentTitle>
  );
};
