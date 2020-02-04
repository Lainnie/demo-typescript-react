import * as React from 'react';

import { ApiCampaign } from '../demand-campaigns/core';

interface Props {
  campaign: Partial<ApiCampaign>;
}

const LineItemListing = ({ campaign }: Props) => {
  return (
    <demeter-container
      class="container--disabled line-item-listing"
      label="Line Items"
    >
      <p className="description" slot="description">
        A line item contains all specifications of an insertion order (buying
        method, promoted product, targeting, ...).
      </p>
      <div className="button-actions">
        <demeter-button mode="secondary">
          Add a Guaranteed line item
        </demeter-button>
        <demeter-button mode="secondary">
          Add a Non Guaranteed line item
        </demeter-button>
      </div>
    </demeter-container>
  );
};

export default LineItemListing;
