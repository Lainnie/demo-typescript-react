import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getBusinessEntityLandingRoute } from './core';

const Loading = () => (
  <demeter-container>
    <div className="wrapperForm" data-testid="authent-loading">
      <div className="content-loading">
        <div className="title">
          <demeter-global-spinner color="primary-gradient" />
        </div>
        <div className="button">
          <demeter-button identifier="backToLogin" mode="primary" type="button">
            Loading...
          </demeter-button>
        </div>
      </div>
    </div>
  </demeter-container>
);

interface Props {
  attemptInProgress: boolean;
  redirectTo: string;
}

class LoadingBehavior extends React.Component<Props, {}> {
  render() {
    return (
      <>
        <Loading />
        {!this.props.attemptInProgress && (
          <Redirect
            to={{
              pathname: this.props.redirectTo,
            }}
          />
        )}
      </>
    );
  }
}

const mapStoreToProps = (store: any) => ({
  attemptInProgress: store.authent.user.requestInProgress,
  redirectTo: store.authent.user.user.id
    ? getBusinessEntityLandingRoute(store.authent.user.business_entity)
    : '/login',
});

export default connect(
  mapStoreToProps,
  {}
)(LoadingBehavior);
