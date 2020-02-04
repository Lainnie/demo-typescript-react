import * as _ from 'lodash';
import * as React from 'react';
import * as Loadable from 'react-loadable';

import { connect } from 'react-redux';
import { Route, RouteProps } from 'react-router-dom';

import PageLoading from '../shared/PageLoading';
import Layout from './Layout';
import './Login.css';

import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';

const LoginForm = Loadable({
  loader: () => import('./LoginForm'),
  loading: () => <PageLoading />,
});

const Loading = Loadable({
  loader: () => import('./Loading'),
  loading: () => <PageLoading />,
});

const EmailCheck = Loadable({
  loader: () => import('./EmailCheck'),
  loading: () => <PageLoading />,
});

const EmailForgotten = Loadable({
  loader: () => import('./EmailForgotten'),
  loading: () => <PageLoading />,
});

const routes: RouteProps[] = [
  {
    component: LoginForm,
    exact: true,
    path: '/login',
  },
  {
    component: EmailForgotten,
    exact: true,
    path: '/login/forgot_password',
  },
  {
    component: EmailCheck,
    exact: true,
    path: '/login/forgot_password/check',
  },
  {
    component: Loading,
    exact: true,
    path: '/login/loading',
  },
];

interface Props {
  routes: RouteProps[];
}

interface State {
  email: string;
  password: string;
}

const getPage = (Component: any, props: any) => (
  <AthenaDocumentTitle pageName="Login">
    <Layout>
      <div className="login" data-testid="login">
        <Component {...props} />
      </div>
    </Layout>
  </AthenaDocumentTitle>
);

class Login extends React.Component<Props, State> {
  static defaultProps = {
    routes,
  };

  state = {
    email: '',
    password: '',
  };

  setParentState = (key: string, value: string) => {
    // @ts-ignore
    this.setState(state => ({
      [key]: value,
    }));
  };

  getRoutes = () => {
    const renderComponent = (route: RouteProps) => (props: any) =>
      getPage(route.component, {
        ...props,
        ...this.state,
        setParentState: this.setParentState,
      });

    return _.map(this.props.routes, route => (
      <Route
        {...route}
        key={`route-${route.path}`}
        render={renderComponent(route)}
        component={undefined}
      />
    ));
  };

  render() {
    return this.getRoutes();
  }
}

const mapStoreToProps = (store: any) => ({});

export default connect(
  mapStoreToProps,
  {}
)(Login);
