import * as React from 'react';
import { useContainerLabelStepper, useEvent } from '../../shared/use';
import { LineItemContext, LineItemSectionProps } from '../CommonDemandWorkflowLineItem';
import { InputPeriod } from '../../shared/InputPeriod';

import './LineItemGeneral.css';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── LINE ITEM GENERAL ──────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────
interface LineItemGeneralProps extends LineItemSectionProps {

}

function LineItemGeneral(props: LineItemGeneralProps) {
  const ref = React.useRef(null);
  const ContainerStepper = useContainerLabelStepper('Name, budget & period', 1);
  const lineItemState = React.useContext(LineItemContext);

  useEvent({
    onHandler: onChange,
    eventType: 'demeter-input-change',
    debounceFor: 300,
    refEl: ref,
  });

  function onChange(event: CustomEvent) {
    const partial = {
      [event.detail.identifier]: event.detail.value,
    };
    props.updateFieldState(partial);
  }

  function onPeriodChange(range: [Date, Date]) {
    props.updateFieldState({
      start_date: range[0],
      end_date: range[1],
    });
  }

  return (
    <demeter-container class="line-item-general" ref={ref}>
      <div className="inputs">
        <demeter-input-text
          identifier="name"
          label="Name"
          value={lineItemState.fieldsState.name}
          error={lineItemState.errors.name}
        />
        <demeter-input-text
          identifier="budget"
          label="Budget"
          value={lineItemState.fieldsState.budget}
          error={lineItemState.errors.budget}
        />
        <InputPeriod
          startDate={lineItemState.fieldsState.start_date!}
          endDate={lineItemState.fieldsState.end_date!}
          onChange={onPeriodChange}
        />
      </div>
      <ContainerStepper />
    </demeter-container>
  );
}

export default LineItemGeneral;
