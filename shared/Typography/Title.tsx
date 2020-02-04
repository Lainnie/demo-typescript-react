import * as React from 'react';

import Text from './Text';

interface Props {
  children: React.ReactNode;
  mode?: string;
}

const Title = (props: Props) => <Text fontSize={30} {...props} />;

export default Title;
