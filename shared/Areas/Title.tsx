import * as React from 'react';

import Headline from '../Typography/Headline';

import './Title.css';

interface Props {
  children: React.ReactNode;
  style?: object,
}

const Title = (props: Props) => 
  <div
    className="area-title"
    style={props.style}
  >
    <Headline>{props.children}</Headline>
  </div>

export default Title;
