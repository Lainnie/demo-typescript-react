import * as React from 'react';
import { render, fireEvent } from 'athena-testing-library';
import Base from '../Base';

beforeEach(() => {
  Object.defineProperty(document.body, 'clientWidth', { value: 1024, writable: false, configurable: true })
});

test('logo should not shrink when clicked on small screens', async () => {
  const { getByDemeterAlt} = render( <Base /> );
  const logo = getByDemeterAlt('logo');
  fireEvent.click(logo);
  getByDemeterAlt('logo');
});
