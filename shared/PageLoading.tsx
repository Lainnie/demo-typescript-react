import * as React from 'react';

import './PageLoading.css';
import Body from './Typography/Body';

interface Props {
  pastDelay?: boolean;
}

class PageLoading extends React.Component<Props, {}> {
  state = {
    ready: false,
  };

  render() {
    let { pastDelay } = this.props;

    pastDelay = pastDelay === undefined ? true : pastDelay;

    if (pastDelay) {
      return (
        <div className="page-loading">
          <div className="blur" />
          <div className="loader">
            <Body>Loading</Body>
            <demeter-global-spinner
              alt="global-spinner"
              color="primary-gradient"
            />
          </div>
        </div>
      );
    }

    return null;
  }
}

export default PageLoading;
