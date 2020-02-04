import * as React from 'react';
import {
  fireEvent,
  render,
  wait,
  waitForElement,
} from 'athena-testing-library';

import Base from '../Base';

const navigations = [
  {
    extras: { path: '/supply/cockpit' },
    icon: 'tachometer-alt',
    identifier: 'menu-cockpit',
    name: 'cockpit',
  },
];

const settings = [
  {
    extras: {},
    icon: 'bell',
    identifier: 'menu-notifications',
    name: 'notifications',
  },
];

const Validation = () => <div className="validation" />;

test('base component when connected', async () => {
  const {
    getByDemeterIdentifier,
    getByTestId,
    queryByTestId,
    container,
  } = render(
    <Base navigations={navigations} settings={settings}>
      <Validation />
    </Base>
  );

  await wait(() =>
    expect(queryByTestId('validation-activated')).not.toBeInTheDocument()
  );

  fireEvent(document, new CustomEvent('activate-validation', {}));

  const validation = await waitForElement(() =>
    getByTestId('validation-activated')
  );

  expect(validation).toHaveClass('active');

  fireEvent(document, new CustomEvent('deactivate-validation', {}));

  await wait(() =>
    expect(queryByTestId('validation-activated')).not.toBeInTheDocument()
  );
  expect(validation).not.toHaveClass('active');
});
