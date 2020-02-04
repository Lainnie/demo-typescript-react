import * as React from 'react';

import Text from './Text';

interface Props {
  children: React.ReactNode;
  mode?: string;
  style?: {
    [cssRule: string]: string,
  }
}

const Body = (props: Props) => <Text fontSize={14} {...props} />;

export default Body;
