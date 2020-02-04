import * as React from 'react';

import './Menu.css';

import { useEvent, useRedirect } from '../use';

interface Props {
  children: React.ReactNode;
}

interface PropsItem {
  children: React.ReactNode;
  path?: string;
}

const Menu = ({ children }: Props) => {
  return <div className="area-menu">{children}</div>;
};

const MenuItem = ({ children, path }: PropsItem) => {
  const refEl = React.useRef(null);
  const [redirect, setRedirect] = useRedirect();
  const [active, setActive] = React.useState(false);
  const activeClass = active ? 'active' : '';

  React.useEffect(() => {
    setActive(location.pathname === path);
  }, []);

  useEvent({
    eventType: 'click',
    onHandler: onClick,
    refEl,
    selector: '.item-text',
  });

  function onClick(_event: CustomEvent) {
    if (path) {
      setRedirect(path);
    }
  }

  return (
    <>
      <div ref={refEl} className={`area-menu-item ${activeClass}`}>
        <p className="item-text">{children}</p>
        <span className="item-active">
          <i className="fas fa-circle" />
        </span>
      </div>
      {redirect}
    </>
  );
};

Menu.Item = MenuItem;

export default Menu;
