import * as React from 'react';
import { render } from 'athena-testing-library';

import Title from '../Title';

test('renders paragraphs with font-size 30 font-weight 400', () => {
  const text = 'Some title';
  const { getByText } = render(<Title>{text}</Title>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('30px');
  expect(el.style['font-weight']).toEqual('400');
});
