import * as React from 'react';

class EmailForgotten extends React.Component {
  el: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  state = {
    email: '',
    emptyEmail: false,
    wrongEmail: false,
  };

  checkMail = (mail: string) => {
    const reg = new RegExp(
      '^[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$',
      'i'
    );
    return reg.test(mail);
  };

  sendMail = () => {
    if (this.checkMail(this.state.email)) {
      this.setState(state => ({
        email: '',
        state: 'check',
        wrongEmail: false,
      }));
    } else {
      this.setState({
        wrongEmail: true,
      });
    }
  };

  emptyEmail = () => {
    return this.state.emptyEmail ? this.msgEmpty() : '';
  };

  msgEmpty = () => {
    return 'Error this field is empty';
  };

  render() {
    return (
      <demeter-container>
        <div className="wrapperForm">
          <div className="content email" ref={this.el}>
            <h2 className="title">
              Please enter your email to change your password
            </h2>
            <div className="log">
              <demeter-input-text
                identifier="email"
                label="Email"
                error={this.emptyEmail()}
              />
            </div>
            <div className="button">
              <demeter-button
                identifier="submitButton"
                mode="primary"
                type="button"
              >
                Send
              </demeter-button>
            </div>
          </div>
        </div>
      </demeter-container>
    );
  }

  get $el() {
    return this.el.current!;
  }

  onDemeterButtonClick = (event: CustomEvent) => {
    switch (event.detail.identifier) {
      case 'submitButton':
        return this.sendMail();
      default:
        return null;
    }
  };

  onDemeterInputTextChange = (event: CustomEvent) => {
    this.setState(state => ({
      [event.detail.identifier]: event.detail.value,
    }));
  };

  componentDidMount() {
    this.$el.addEventListener(
      'demeter-button-click',
      this.onDemeterButtonClick
    );

    this.$el.addEventListener(
      'demeter-input-change',
      this.onDemeterInputTextChange
    );
  }

  componentWillUnmount() {
    this.$el.removeEventListener(
      'demeter-input-change',
      this.onDemeterButtonClick
    );
    this.$el.removeEventListener(
      'demeter-button-click',
      this.onDemeterInputTextChange
    );
  }
}

export default EmailForgotten;
