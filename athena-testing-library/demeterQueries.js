import reduce from 'lodash/reduce';

import * as domTestingLib from 'dom-testing-library';
const { queryHelpers } = domTestingLib;

const queryDemeterMap = {
  alt: {
    selector: 'alt',
    suffix: 'Alt',
  },
  identifier: {
    selector: 'identifier',
    suffix: 'Identifier',
  },
  label: {
    selector: 'label',
    suffix: 'Label',
  },
  name: {
    selector: 'name',
    suffix: 'Name',
  },
};

const demeterQueries = reduce(
  queryDemeterMap,
  (queries, config, selector) => {
    const queryByDemeter = queryHelpers.queryByAttribute.bind(null, selector);
    const queryAllByDemeter = queryHelpers.queryAllByAttribute.bind(
      null,
      selector
    );

    const getAllByDemeter = (container, id, ...rest) => {
      const els = queryAllByDemeter(container, id, ...rest);
      if (!els.length) {
        throw queryHelpers.getElementError(
          `Unable to find an element by: [${selector}="${id}"]`,
          container
        );
      }
      return els;
    };

    const getByDemeter = (...args) => {
      return queryHelpers.firstResultOrNull(getAllByDemeter, ...args);
    };

    const getMethodName = `getByDemeter${config.suffix}`;
    const getAllMethodName = `getAllByDemeter${config.suffix}`;
    const queryMethodName = `queryByDemeter${config.suffix}`;
    const queryAllMethodName = `queryAllByDemeter${config.suffix}`;

    queries[getMethodName] = getByDemeter;
    queries[getAllMethodName] = getAllByDemeter;
    queries[queryMethodName] = queryByDemeter;
    queries[queryAllByDemeter] = queryAllByDemeter;

    return queries;
  },
  {}
);

export default demeterQueries;
