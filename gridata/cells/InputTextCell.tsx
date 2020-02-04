import * as React from 'react';
import { CellInfo } from 'react-table';

import { useEvent } from '../../shared/use';

type Original<T extends {}> = T & {
  [key: string]: string;
};

interface Props<T> extends CellInfo {
  original: Original<T>;
  onChange: ({
    identifier,
    value,
    id,
  }: {
    identifier: string;
    value: string;
    id: string;
  }) => void;
}

function InputTextCell<T>(props: Props<T>) {
  const ref = React.useRef(null);
  const columnId = props.column.id || '';
  const [value, setValue] = React.useState('');

  useEvent({
    eventType: 'demeter-input-change',
    onHandler: onChange,
    refEl: ref,
  });

  React.useEffect(() => {
    if (columnId) {
      setValue(props.original[columnId]);
    }
  }, [columnId]);

  React.useEffect(() => {
    if (props.original[columnId] !== value) {
      setValue(props.original[columnId]);
    }
  }, [props.original[columnId]]);

  function onChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();

    props.onChange({
      identifier: event.detail.identifier,
      value: event.detail.value,
      id: props.original.id,
    });
  }

  return (
    <demeter-input-text ref={ref} value={value} identifier={props.column.id} />
  );
}

export default InputTextCell;
