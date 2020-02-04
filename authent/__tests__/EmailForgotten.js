import * as React from 'react';
import { render, fireEvent } from 'athena-testing-library';

import EmailForgotten from '../EmailForgotten';

test('Submit form', () => {
  const { getByDemeterLabel, getByDemeterIdentifier, container } = render(
    <EmailForgotten />
  );

  fireEvent.demeterInputChange(getByDemeterLabel('Email'), {
    detail: { value: 'quser@yourhost.com', identifier: 'email' },
  });

  fireEvent.demeterButtonClick(getByDemeterIdentifier('submitButton'), {
    detail: { identifier: 'submitButton' },
  });
});
