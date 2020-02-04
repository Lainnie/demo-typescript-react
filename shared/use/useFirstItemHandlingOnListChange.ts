import * as React from 'react';

/**
 * Automatically handle the first item of a list on change and if list is not empty
 * @param list - List of items to be observed
 * @param firstItemHandler - First item handler
 */
function useFirstItemHandlingOnListChange<T>(list: T[], firstItemHandler: (item: T) => void) {
  React.useEffect(() => {
    if (list.length) {
      firstItemHandler(list[0]);
    }
  }, [list]);
}

export default useFirstItemHandlingOnListChange;
