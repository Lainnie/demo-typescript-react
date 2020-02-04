import * as _ from 'lodash';
import * as React from 'react';

import { Route, RouteProps } from 'react-router-dom';

import useEvent from './useEvent';
import useRedirect from './useRedirect';
import useRegisterForStore from './useRegisterForStore';
import useShortcuts from './useShortcuts';

import { useCurrentUser } from '../../authent/core';

import Page from '../Page';

interface UniversProps {
  univers: 'supply'|'demand';
  switchRedirect: string;
  routes: RouteProps[];
  reducers?: any;
  epics?: any;
}

const Shortcut = () => {
  const redirect = useShortcuts();

  return <>{redirect}</>;
};

const getPage = (Component: any, props: any) => {
  return (
    <Page>
      <Component {...props} />
      <Shortcut />
    </Page>
  );
};

function useUnivers({
  epics,
  reducers,
  routes,
  switchRedirect,
  univers,
}: UniversProps) {
  const refEl = React.useRef(null);
  const user = useCurrentUser();
  const [redirect, setRedirect] = useRedirect();
  const [rebind, setRebind] = React.useState(+new Date());

  useEvent({
    eventType: 'click',
    onHandler: handlerSwitch,
    rebind,
    refEl,
    selector: '.menu-user-settings',
  });
  useEvent({
    eventType: 'click',
    onHandler: handlerLogout,
    rebind,
    refEl,
    selector: '.menu-sign-out',
  });
  useRegisterForStore({ epics, reducers, identifier: univers });

  React.useEffect(() => {
    document.addEventListener('rebind-settings', handlerRebind);
    return () => {
      document.removeEventListener('rebind-settings', handlerRebind);
    };
  }, []);

  function handlerRebind() {
    setRebind(+new Date());
  }

  function getRoutes() {
    const renderComponent = (route: RouteProps) => (props: any) =>
      getPage(route.component, props);

    return _.map(routes, route => (
      <Route
        {...route}
        key={`route-${route.path}`}
        render={renderComponent(route)}
        component={undefined}
      />
    ));
  }

  function handlerSwitch(event: CustomEvent) {
    event.stopPropagation();

    setRedirect(switchRedirect);
  }

  function handlerLogout(event: CustomEvent) {
    event.stopPropagation();

    setRedirect('/logout', false);
  }

  return {
    getRoutes,
    redirect,
    refEl,
    user,
  };
}

export default useUnivers;
