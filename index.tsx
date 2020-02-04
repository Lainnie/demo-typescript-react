import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Init, serviceWorker } from './init';

if (process.env.NODE_ENV === 'development') {
  const a11y = require('react-a11y').default;
  a11y(React, ReactDOM, {
    // See other rules here: https://github.com/reactjs/react-a11y/tree/master/docs/rules
    rules: {
      'img-uses-alt': 'warn',
    },
  });
}

ReactDOM.render(<Init />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
