import * as React from 'react';
import { render } from 'athena-testing-library';

import Headline from '../Headline';

test('render paragraphs with font-size 40 font-weight 400', () => {
  const text = 'Some title';
  const { getByText } = render(<Headline>{text}</Headline>);

  const el = getByText(text);

  expect(el.style['font-size']).toEqual('40px');
  expect(el.style['font-weight']).toEqual('400');
});
