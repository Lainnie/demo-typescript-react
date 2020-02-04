import * as React from 'react';
import { useEvent } from '../../shared/use';

const SwitchCell = (props: any) => {
  if (props.value.value === 'true' || props.value.value === 'false') {
    const refEl = React.useRef(null);
    useEvent({
      eventType: 'demeter-switch-change',
      onHandler: props.handlerChange,
      refEl,
    });

    const disabled = props.value.disabled ? props.value.disabled : false;

    const color =
      props.value.universe === 'supply'
        ? 'var(--color-supplyUniverse-primary)'
        : 'var(--color-demandUniverse-primary)';

    return (
      <div>
        <demeter-switch
          style={{
            '--color-primary': color,
          }}
          id="switchZones"
          ref={refEl}
          disabled={disabled}
          active={props.value.value}
          labeloff="Off"
          labelon="On"
          size="S"
          identifier={props.value.filter}
        />
      </div>
    );
  } else {
    return <div>{props.value.value}</div>;
  }
};

export default SwitchCell;
