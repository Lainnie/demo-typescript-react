import * as React from 'react';
import { render } from 'react-testing-library';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { StoreContext } from 'redux-react-hook';
import { Router } from 'react-router-dom';
import reduce from 'lodash/reduce';

import store from '../init/store';

import demeterQueries from './demeterQueries';

const customRender = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) => {
  const node = {
    ...ui,
    props: {
      ...ui.props,
      history: history,
    },
  };

  const rendered = render(
    <Provider store={store}>
      <StoreContext.Provider value={store}>
        <Router history={history}>{node}</Router>
      </StoreContext.Provider>
    </Provider>
  );

  const boundQueries = reduce(
    demeterQueries,
    (helpers, query, queryName) => {
      helpers[queryName] = query.bind(null, rendered.container);

      return helpers;
    },
    {}
  );

  return {
    ...rendered,
    ...boundQueries,
  };
};

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
