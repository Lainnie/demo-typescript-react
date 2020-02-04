import * as React from 'react';

interface Props<T> {
  onclick: ((id: string) => any);
  value: PropsValue;
}

interface PropsValue {
  label: string;
  id: string;
}

function ActionCell<T>(props: Props<T>) {
  function onClick(event: any) {
    props.onclick(props.value.id);
  }

  return (
    <div
      className="action-cell"
      onClick={onClick}
      onKeyUp={onClick}
      tabIndex={-1}
      role="button"
    >
      <span style={{ textDecoration: 'underline' }}>{props.value.label}</span>
    </div>
  );
}

export default ActionCell;
