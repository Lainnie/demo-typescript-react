import * as React from 'react';

import PageLoading from './PageLoading';

class Page extends React.Component {
  static minimalWaitingPeriod = 1000;

  // We could useRef when hooks are production ready, stay strong!!!
  timer: any;

  state = {
    minimalWaiting: false,
    ready: false,
    shouldWait: false,
  };

  initiateLoadingPage = () => {
    this.setState(state => ({
      shouldWait: true,
    }));
  };

  loadingPageOver = () => {
    this.setState(state => ({
      ready: true,
    }));
  };

  displayPage = () => {
    return (
      !this.state.shouldWait || (this.state.ready && this.state.minimalWaiting)
    );
  };

  render() {
    if (this.displayPage()) {
      return React.Children.map(this.props.children, child => {
        // @ts-ignore: Type 'string' is not assignable to type 'ReactElement<any>'
        return React.cloneElement(child, {
          initiateLoadingPage: this.initiateLoadingPage,
          loadingPageOver: this.loadingPageOver,
        });
      });
    }

    return React.Children.map(this.props.children, child => {
      // @ts-ignore: Type 'string' is not assignable to type 'ReactElement<any>'
      return React.cloneElement(child, {
        initiateLoadingPage: this.initiateLoadingPage,
        loadingPageOver: this.loadingPageOver,
        renderProps: (props: any) => <PageLoading />,
      });
    });
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState(state => ({
        minimalWaiting: true,
      }));
    }, Page.minimalWaitingPeriod);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}

export default Page;
