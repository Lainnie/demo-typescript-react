import * as React from 'react';
import { render, waitForElement } from 'athena-testing-library';

import Login from '../Login';

test('renders login form', async () => {
  const { getByTestId } = render(<Login />, { route: '/login' });

  await waitForElement(() => getByTestId('login'));
});
