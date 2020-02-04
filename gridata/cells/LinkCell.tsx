import * as React from 'react';

import { useRedirect } from '../../shared/use';

interface Props<T> {
  path: string | ((original: T) => string);
  original: T;
  value: string;
}

type CellEvent =
  | React.KeyboardEvent<HTMLElement>
  | React.MouseEvent<HTMLElement, MouseEvent>;

function updatePath<T = any>(
  setPath: React.Dispatch<React.SetStateAction<string>>,
  props: Props<T>
) {
  if (typeof props.path === 'function') {
    setPath(props.path(props.original));
  } else {
    setPath(props.path);
  }
}

function LinkCell<T>(props: Props<T>) {
  const [redirect, setRedirect] = useRedirect();
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    updatePath(setPath, props);
  }, [props.original]);

  function onClick(event: CellEvent) {
    const hasModifiers = event.metaKey || event.ctrlKey;

    if (!hasModifiers) {
      event.preventDefault();
      event.stopPropagation();

      setRedirect(path);
    }
  }

  return (
    <div
      tabIndex={-1}
      className="link-cell"
      onClick={onClick}
      onKeyUp={onClick}
      role="button"
    >
      <>
        {redirect}
        <a href={path}>{props.value}</a>
      </>
    </div>
  );
}

export default LinkCell;
