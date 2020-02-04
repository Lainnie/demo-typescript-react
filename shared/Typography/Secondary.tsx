import * as React from 'react';

import Text from './Text';

interface Props {
  children: React.ReactNode;
  mode?: string;
}

const Secondary = (props: Props) => <Text fontSize={14} {...props} />;

export default Secondary;
