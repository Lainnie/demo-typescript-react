import * as React from 'react';
import { render } from 'athena-testing-library';

import Secondary from '../Secondary';

test('renders paragraphs with font-size 14 font-weight 400', () => {
  const text = 'Some title';
  const { getByText } = render(<Secondary>{text}</Secondary>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('14px');
  expect(el.style['font-weight']).toEqual('400');
});

test('renders paragraphs with font-size 14 font-weight 500', () => {
  const text = 'Some title';
  const { getByText } = render(<Secondary mode="medium">{text}</Secondary>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('14px');
  expect(el.style['font-weight']).toEqual('500');
});

test('renders paragraphs with font-size 14 font-weight 700', () => {
  const text = 'Some title';
  const { getByText } = render(<Secondary mode="bold">{text}</Secondary>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('14px');
  expect(el.style['font-weight']).toEqual('700');
});
