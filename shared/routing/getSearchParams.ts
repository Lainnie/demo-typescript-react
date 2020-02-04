/**
 * Transforms the location's 'search' value into an accessible object gathering all key/val couples
 *
 * @param search - location's 'search' value
 */
export const getSearchParams = <SP = {}>(search: string): SP => {
  if (search.length > 3) {
    const urlSearchParams = new URLSearchParams(search);
    let searchParams = {} as SP;

    for (const [key, value] of urlSearchParams) {
      let preparedValue: boolean|string|number|undefined = undefined;

      if (value === 'true' || value === 'false') {
        preparedValue = value === 'true'
          ? true
          : false;
      } else if(isNaN(+value)) {
        preparedValue = value;
      } else {
        preparedValue = +value;
      }

      searchParams = {
        ...searchParams,
        [key]: preparedValue,
      }
    }

    return searchParams;
  }
  return {} as SP;
};
