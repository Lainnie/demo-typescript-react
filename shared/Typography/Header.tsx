import * as React from 'react';

import Text from './Text';

interface Props {
  children: React.ReactNode;
  mode?: string;
}

const Header = (props: Props) => <Text fontSize={24} {...props} />;

export default Header;
