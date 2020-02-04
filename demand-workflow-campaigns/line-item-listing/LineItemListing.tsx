import * as _ from 'lodash';
import * as React from 'react';

import { CellInfo } from 'react-table';

import { DataTable } from '../../gridata/DataTable';
import { LineItemCell, LinkCell } from '../../gridata/cells';

import { useRedirect } from '../../shared/use';
import { getDynamicPath } from '../../shared/utils/paths';


import './LineItemListing.css';
import { CrownSVC } from 'olympus-anesidora';

interface LineItem {
  id: string;
  name: string;
  dealType: string;
  status: string;
  campaign?: {
    id: string,
  }
}

interface Props {
  lineItemList: CrownSVC.LineItem[];
  campaign_id: string;
}

interface LineItemCellProps extends CellInfo {
  original: CrownSVC.LineItem,
};

const statusMappings: {
  [key in CrownSVC.LineItem_status]: string
} = {
  [CrownSVC.LineItem_status.ARCHIVED]: 'Archived',
  [CrownSVC.LineItem_status.BOOKED]: 'Booked',
  [CrownSVC.LineItem_status.LIVE]: 'Validated - Live',
  [CrownSVC.LineItem_status.PAUSED]: 'Paused',
  [CrownSVC.LineItem_status.STOPPED]: 'Stopped',
  [CrownSVC.LineItem_status.VALIDATED]: 'Validated - Waiting for diffusion',
  [CrownSVC.LineItem_status.WIP]: 'Draft',
};

const LineItemListing = ({ campaign_id, lineItemList }: Props) => {
  const refEl = React.useRef(null);

  const [redirect, setRedirect] = useRedirect();
  const onGridReady = React.useCallback(() => {}, []);

  const [gridOptions, setGridOptions] = React.useState({
    columnDefs: [
      {
        field: 'name',
        headerName: 'Name',
        cellRenderer: (props: CellInfo) => (
          <LinkCell
            {...props}
            path={(original: CrownSVC.LineItem) =>
              getDynamicPath('demand.workflow.lineItem', {
                campaign_id: original.campaign!.id,
                line_item_id: original.id!,
              }, {
                guaranteed: original.item_type === CrownSVC.LineItem_itemType.GUARANTEED
              })
            }
          />
        ),
      },
      {
        headerName: 'Deal Type',
        field: 'item_type',
        cellRenderer: (props: LineItemCellProps) => {
          return props.original.item_type === CrownSVC.LineItem_itemType.GUARANTEED
            ? 'Guaranteed'
            : 'Non Guaranteed';
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (props: LineItemCellProps) => statusMappings[props.original.status],
      },
      {
        field: 'actions',
        headerName: 'Actions',
        cellRenderer: (props: LineItemCellProps) => (
          <LineItemCell
            {...props}
            onClose={removeLineItem}
            onCopy={copyAsNew}
          />
        ),
      },
    ],
    onGridReady,
    rawData: lineItemList,
  });

  React.useEffect(() => {
    setGridOptions(go => ({
      ...go,
      rawData: getLineitems(),
    }));
  }, [lineItemList]);

  function getLineitems() {
    return _.map(lineItemList, li => ({
      ...li,
      // item_type:
      //   li.item_type === 'guaranteed' ? 'Guaranteed' : 'Non Guaranteed',
      // status: li.status,
    }));
  }

  function addGuaranteed() {
    setRedirect(`${getDynamicPath('demand.workflow.newLineItem', { campaign_id }, {
      guaranteed: true,
    })}`);
  }

  function copyAsNew() {
    // TODO: Make a real copy
  }

  function removeLineItem() {
    // TODO: Delete
  }

  return (
    <demeter-container class="line-item-listing" label="Line Items" ref={refEl}>
      {redirect}
      {lineItemList.length > 0 && <DataTable gridOptions={gridOptions} />}
      <div className="button-actions">
        <demeter-button
          mode="secondary"
          identifier="add-guaranteed"
          onClick={addGuaranteed}
        >
          Add Guaranteed line item
        </demeter-button>
        <demeter-button mode="secondary" identifier="create-campaign" disabled>
          Add Non Guaranteed line item
        </demeter-button>
      </div>
      <p className="description" slot="description">
        Listing of line item for this campaign.
        <br />
        Use buttons underneath to add new guarantee or non-guarantee line items.
      </p>
    </demeter-container>
  );
};

export default LineItemListing;
