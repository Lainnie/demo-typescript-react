import * as React from 'react';
import { render, fireEvent } from 'athena-testing-library';
import Base from '../Base';

beforeEach(() => {
  Object.defineProperty(document.body, 'clientWidth', { value: 1920, writable: false, configurable: true })
});

test('logo should shrink and get back to large when clicked twice on large screens', () => {
  const { getByDemeterAlt } = render( <Base /> );
  const logoLarge = getByDemeterAlt('logo-large');
  fireEvent.click(logoLarge);
  const logo = getByDemeterAlt('logo');
  fireEvent.click(logo);
  getByDemeterAlt('logo-large');
});

test('logo should shrink when clicked on large screens', () => {
  const { getByDemeterAlt } = render( <Base /> );
  const logoLarge = getByDemeterAlt('logo-large');
  fireEvent.click(logoLarge);
  getByDemeterAlt('logo');
});