import * as React from 'react';

/**
 * Returns the previous state of a value
 *
 * @param value - The value from which you want the previous state
 */
export function usePrevious<T>(value: T): T {
  const ref = React.useRef<T>(value);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}