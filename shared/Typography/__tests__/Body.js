import * as React from 'react';
import { render } from 'athena-testing-library';

import Body from '../Body';

test('renders paragraphs with font-size 14 font-weight 400', () => {
  const text = 'Some title';
  const { getByText } = render(<Body>{text}</Body>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('14px');
  expect(el.style['font-weight']).toEqual('400');
});

test('renders paragraphs with font-size 14 font-weight 500', () => {
  const text = 'Some title';
  const { getByText } = render(<Body mode="medium">{text}</Body>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('14px');
  expect(el.style['font-weight']).toEqual('500');
});

test('renders paragraphs with font-size 14 font-weight 700', () => {
  const text = 'Some title';
  const { getByText } = render(<Body mode="bold">{text}</Body>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('14px');
  expect(el.style['font-weight']).toEqual('700');
});
