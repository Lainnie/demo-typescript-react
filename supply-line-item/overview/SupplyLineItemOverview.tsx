import * as _ from 'lodash';
import * as React from 'react';
import * as numeral from 'numeral';
import { Body } from '../../shared/Typography';
import AthenaDocumentTitle from '../../shared/components/AthenaDocumentTitle';
import { percentageFormat, currencyFormat } from '../utils';


export const SupplyLineItemOverview = ({ lineItemRetailers }: { lineItemRetailers : any[] }) => {
  const liveCampaigns = lineItemRetailers.length;
  const eCPM = () => {
    if (lineItemRetailers.length > 0) {
      return Math.random() * (35 - 25) + 25;
    }
    return 0;
  };
  const eCPM_zones = () => {
    if (lineItemRetailers.length > 0) {
      return Math.random() * (35 - 25) + 25;
    }
    return 0;
  };

  const budgetEstimated:number = lineItemRetailers.reduce((sum: number, lineItemRetailer) => {
    return sum + (lineItemRetailer.line_item.budget as number);
  }, 0);

  const budgetMin = 0.70 * budgetEstimated;

  const nbrImpressions = lineItemRetailers.reduce((sum: number, lineItemRetailer:any) => {
    return Number(sum) + Number(lineItemRetailer.line_item.imp);
  }, 0);

  return (
    <AthenaDocumentTitle pageName="Line Item">
      <demeter-container class="container-general" label="Overview">
        <div className="grid-content" slot="">
          <div className="column-1-3">
            <Body>Number of live campaigns:</Body>
            <Body mode="bold">
              {liveCampaigns}{' '}
              {liveCampaigns === 0 || liveCampaigns === 1
                ? 'Campaign'
                : 'Campaigns'}
            </Body>
          </div>
          <div className="column-3-5">
            <Body>Average eCPM:</Body>
            <Body mode="bold">{numeral(eCPM()).format(currencyFormat)}</Body>
          </div>
          <div className="column-5-7">
            <Body>Average eCPM on allowed zones:</Body>
            <Body mode="bold">{numeral(eCPM_zones()).format(currencyFormat)}</Body>
          </div>
          <div className="column-1-3">
            <Body>Minimum booked budget:</Body>
            <Body mode="bold">{numeral(budgetMin).format(currencyFormat)}</Body>
          </div>
          <div className="column-3-5">
            <Body>Estimated committed budget:</Body>
            <Body mode="bold">{numeral(budgetEstimated).format(currencyFormat)}</Body>
          </div>
          <div className="column-5-7">
            <Body>Number of impressions</Body>
            <Body mode="bold">
              {numeral(nbrImpressions).format('0,0')}{' '}
              {nbrImpressions === 0 || nbrImpressions === 1
                ? 'Impression'
                : 'Impressions'}
            </Body>
          </div>
        </div>
      </demeter-container>
    </AthenaDocumentTitle>
  );
};
