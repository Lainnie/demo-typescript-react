import * as React from 'react';
import * as _ from 'lodash';
import * as Loadable from 'react-loadable';

import { ajax, CustomAjaxResponse } from '../shared/ajax';

import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { StoreContext, useMappedState } from 'redux-react-hook';
import { interval, throwError } from 'rxjs';
import {
  catchError,
  delay,
  map,
  retryWhen,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import * as logger from '../shared/logger';
import PageLoading from '../shared/PageLoading';
import { getPath } from '../shared/utils/paths';

import { getGateway } from '../shared/utils';

import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';

import store from './store';

// Bundled pages
import Login from '../authent/Login';

import Logout from '../authent/Logout';
import {
  useBusinessEntity,
  getBusinessEntityLandingRoute,
} from '../authent/core';

// Splitted pages
const Demand = Loadable({
  loader: () => import('../demand/Demand'),
  loading: props => <PageLoading {...props} />,
});

const Supply = Loadable({
  loader: () => import('../supply/Supply'),
  loading: props => <PageLoading {...props} />,
});

const mapStateLoggedIn = (state: any) => {
  return {
    loggedIn: !!state.authent.user.user.id,
  };
};

const useLoggedIn = () => {
  const { loggedIn } = useMappedState(mapStateLoggedIn);

  return loggedIn;
};

const RootRedirection = () => {
  const loggedIn = useLoggedIn();
  const businessEntity = useBusinessEntity();

  if (loggedIn) {
    return <Redirect push to={getBusinessEntityLandingRoute(businessEntity)} />;
  }
  return <Redirect to="/login" />;
};

interface ShortcutAction {
  [key: string]: () => void;
}

interface AvailableShortcuts {
  s: ShortcutAction;
  d: ShortcutAction;

  [key: string]: ShortcutAction;
}

const LoggedRoute = (Component: any) => (props: any) => {
  const loggedIn = useLoggedIn();
  const stopKeepAlive = useKeepAlive({ loggedIn });

  return loggedIn ? (
    <>
      <Component {...props} />
    </>
  ) : (
    <Redirect to={getPath('auth.login')} />
  );
};

const errorMessage = (error: { status: number; message: string }) => {
  logger.error('Keep Alive', error);
};

const getCurrentUser = () => JSON.parse(localStorage.getItem('user') || '{}');

const useKeepAlive = ({ loggedIn }: { loggedIn: boolean }) => {
  const keepAliveInterval = 600_000; // 10 minutes
  const keepAliveRetryInterval = 60_000;

  React.useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const keepAlive$ = interval(keepAliveInterval).pipe(
      startWith(1),
      delay(10000),
      switchMap(() => {
        const currentUser = getCurrentUser();
        const refreshSession = currentUser.refresh_session;
        return ajax({
          url: getGateway(`/gateway/auth/keepalive/${refreshSession}`),
          method: 'GET',
        }).pipe(
          map(ajaxResponse => ajaxResponse.response),
          map(response => {
            const user = getCurrentUser();
            localStorage.setItem(
              'user',
              JSON.stringify({
                ...user,
                client_session: response.access_token,
              })
            );
          }),
          retryWhen(errors =>
            errors.pipe(
              delay(keepAliveRetryInterval),
              take(3),
              tap(errorMessage)
            )
          ),
          catchError(() => {
            return throwError({
              message: 'Behemoth cannot keep you alive!',
              status: 418,
            });
          })
        );
      })
    );

    const sub$ = keepAlive$.subscribe({
      error: errorMessage,
    });

    return () => {
      sub$.unsubscribe();
    };
  }, []);
};

class RoutedLogout extends React.Component {
  render() {
    // @ts-ignore: Hooks does not play well with react-router
    return <Logout />;
  }
}

const Root = () => {
  return (
    <Provider store={store}>
      <StoreContext.Provider value={store}>
        <>
          <AthenaDocumentTitle>
            <Router>
              <Switch>
                <Route exact={true} path="/" component={RootRedirection} />
                <Route path={getPath('auth.login')} component={Login} />
                <Route path={getPath('auth.logout')} component={RoutedLogout} />
                <Route
                  path={getPath('demand.root')}
                  push
                  component={LoggedRoute(Demand)}
                />
                <Route
                  path={getPath('supply.root')}
                  push
                  component={LoggedRoute(Supply)}
                />
                <Route component={Login} />
              </Switch>
            </Router>
          </AthenaDocumentTitle>
        </>
      </StoreContext.Provider>
    </Provider>
  );
};

export default Root;
