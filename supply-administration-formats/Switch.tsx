import * as React from 'react';
import { useEvent } from '../shared/use';

// Switch : a React wrapper for demeter switch component
const Switch = ({
  label,
  active,
  handleClick,
}: {
  label: string;
  active: boolean;
  handleClick: (newActiveValue: boolean) => void;
}) => {
  const refEl = React.useRef(null);

  useEvent({
    refEl,
    eventType: 'demeter-switch-change',
    onHandler: (event: CustomEvent) => {
      if (event.detail.identifier === 'switch') {
        handleClick(event.detail.isActive);
      }
    },
  });

  return (
    <div ref={refEl} className="switch" style={{ padding: '1em 0' }}>
      <demeter-switch
        identifier="switch"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '1em',
          cursor: 'pointer',
        }}
        active={active}
      />
      <span
        style={{ cursor: 'pointer', outline: 'none' }}
        tabIndex={0}
        role="switch"
        aria-checked={active}
        onClick={() => {
          handleClick(!active);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLSpanElement>) => {
          if (event.key === 'Enter') {
            handleClick(!active);
          }
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default Switch;