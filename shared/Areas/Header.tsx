import * as React from 'react';

import './Header.css';

interface Props {
  children: React.ReactNode;
  style?: object,
}

const Header = ({ children }: Props) => {
  return <div className="area-header">{children}</div>;
};

const Left = ({ children, ...rest }: Props) => {
  return <div className="area-header-left" {...rest}>{children}</div>;
};

const Right = ({ children }: Props) => {
  return <div className="area-header-right">{children}</div>;
};

Header.Left = Left;
Header.Right = Right;

export default Header;
