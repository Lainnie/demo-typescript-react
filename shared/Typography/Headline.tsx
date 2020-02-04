import * as React from 'react';

import Text from './Text';

interface Props {
  children: React.ReactNode;
  mode?: string;
}

const Headline = ({ mode, ...props }: Props) => (
  <Text
    className="headline"
    lineHeight="38px"
    fontSize={40}
    mode="regular"
    {...props}
  />
);

export default Headline;
