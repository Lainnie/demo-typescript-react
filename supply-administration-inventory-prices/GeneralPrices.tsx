import * as _ from 'lodash';
import * as React from 'react';
import { useEvent } from '../shared/use';
import { RiseSVC } from 'olympus-anesidora';

const GeneralPrices = ({
  retailer,
  handleOnDataChange,
}: {
  retailer?: RiseSVC.Retailer;
  handleOnDataChange: Function;
}) => {
  const refEl = React.useRef(null);

  useEvent({
    eventType: 'demeter-input-change',
    onHandler: (e: CustomEvent) => {
      if (e.detail.identifier === 'campaignMinimumBudgetInput') {
        const minBudgetUpdated = Number(e.detail.value);
        if (!isNaN(minBudgetUpdated)) {
          handleOnDataChange({ ...retailer, min_budget: minBudgetUpdated });
        }
      }
    },
    refEl,
    rebind: [retailer],
  });

  if (retailer) {
    return (
      <demeter-container
        class={'column-1-7'}
        label={'General prices'}
        ref={refEl}
      >
        <p>Specify your minimum allowed budget per campaign.</p>
        <div style={{ maxWidth: '750px' }}>
          <demeter-input-text
            identifier={'campaignMinimumBudgetInput'}
            label="Minimum budget per campaign"
            value={retailer.min_budget}
            helper="Minimum allowed spent per campaign."
          />
        </div>
      </demeter-container>
    );
  } else {
    return (
      <p ref={refEl}>
        <em>Please choose a retailer.</em>
      </p>
    );
  }
};

export default GeneralPrices;
