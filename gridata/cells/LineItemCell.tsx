import * as React from 'react';

import { CellInfo } from 'react-table';

interface Props<T> extends CellInfo {
  onClose: (event: CellEvent, original: T) => void;
  onCopy: (event: CellEvent, original: T) => void;
}

type CellEvent =
  | React.KeyboardEvent<HTMLElement>
  | React.MouseEvent<HTMLElement, MouseEvent>;

function LineItemCell<T>(props: Props<T>) {
  function onClose(event: CellEvent) {
    props.onClose(event, props.original);
  }

  function onCopy(event: CellEvent) {
    event.preventDefault();

    props.onCopy(event, props.original);
  }

  return (
    <div className="line-item-cell">
      <div className="left" />
      <div className="right">
        <a
          className="copy"
          onClick={onCopy}
          onKeyUp={onCopy}
          role="button"
          href="copy"
        >
          Copy as new
        </a>
        <i
          tabIndex={-1}
          role="button"
          className="far fa-times"
          onClick={onClose}
          onKeyUp={onClose}
        />
      </div>
    </div>
  );
}

export default LineItemCell;
