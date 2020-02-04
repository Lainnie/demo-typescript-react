import * as React from 'react';
import { render } from 'athena-testing-library';

import { Headline, Title, Secondary, Body, Header } from '..';

const message = 'bla bla blo bli bly ble';

test('Headline is a component', () => {
  const { getByText } = render(<Headline>{message}</Headline>);

  getByText(message);
});

test('Title is a component', () => {
  const { getByText } = render(<Title>{message}</Title>);

  getByText(message);
});

test('Header is a component', () => {
  const { getByText } = render(<Header>{message}</Header>);

  getByText(message);
});

test('Secondary is a component', () => {
  const { getByText } = render(<Secondary>{message}</Secondary>);

  getByText(message);
});

test('Body is a component', () => {
  const { getByText } = render(<Body>{message}</Body>);

  getByText(message);
});
