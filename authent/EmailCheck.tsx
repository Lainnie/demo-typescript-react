import { History } from 'history';
import * as React from 'react';

interface Props {
  history: History;
  setRef: React.LegacyRef<HTMLDivElement>;
}

const EmailCheck = (props: Props) => (
  <demeter-container>
    <div className="wrapperForm" ref={props.setRef}>
      <div className="content-check">
        <h2 className="title reduce">
          Please check your email inbox, and click on the link to change your
          password.
        </h2>
        <div className="button">
          <demeter-button identifier="backToLogin" mode="primary" type="button">
            Back to Login
          </demeter-button>
        </div>
      </div>
    </div>
  </demeter-container>
);

class EmailCheckBehavior extends React.Component<Props, {}> {
  el: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  render() {
    return <EmailCheck setRef={this.el} {...this.props} />;
  }

  get $el() {
    return this.el.current!;
  }

  onDemeterButtonClick = (event: CustomEvent) => {
    switch (event.detail.identifier) {
      case 'backToLogin':
        return this.props.history.push('/');
      default:
        return null;
    }
  };

  componentDidMount() {
    this.$el.addEventListener(
      'demeter-button-click',
      this.onDemeterButtonClick
    );
  }

  componentWillUnmount() {
    this.$el.removeEventListener(
      'demeter-button-click',
      this.onDemeterButtonClick
    );
  }
}

export default EmailCheckBehavior;
