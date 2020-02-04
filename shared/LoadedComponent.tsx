import * as React from 'react';

interface Props {
  renderProps: (props: any) => React.ReactNode;
  initiateLoadingPage: () => void;
  loadingPageOver: () => void;
  registerReducers?: () => void;
}

interface State {}

// Don't forget to call super when using componentDidMount.
abstract class LoadedComponent<P, S> extends React.Component<
  Props & P,
  State & S
> {
  constructor(props: Props & P) {
    super(props);

    if (props.registerReducers) {
      props.registerReducers();
    }

    props.initiateLoadingPage();
  }

  render() {
    const {
      initiateLoadingPage,
      loadingPageOver,
      registerReducers,
      renderProps,
      ...rest
    } = this.props;
    return this.props.renderProps(rest);
  }

  componentDidMount() {
    this.props.loadingPageOver();
  }
}

export default LoadedComponent;
