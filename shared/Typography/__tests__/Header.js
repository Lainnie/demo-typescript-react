import * as React from 'react';
import { render } from 'athena-testing-library';

import Header from '../Header';

test('renders paragraphs with font-size 24 font-weight 400', () => {
  const text = 'Some title';
  const { getByText } = render(<Header>{text}</Header>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('24px');
  expect(el.style['font-weight']).toEqual('400');
});

test('renders paragraphs with font-size 24 font-weight 500', () => {
  const text = 'Some title';
  const { getByText } = render(<Header mode="medium">{text}</Header>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('24px');
  expect(el.style['font-weight']).toEqual('500');
});

test('renders paragraphs with font-size 24 font-weight 700', () => {
  const text = 'Some title';
  const { getByText } = render(<Header mode="bold">{text}</Header>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('24px');
  expect(el.style['font-weight']).toEqual('700');
});
