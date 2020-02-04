import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { actions as authentActions, ServerError } from '../authent/core';

type HandleSubmitMethod = (event: React.KeyboardEvent<Element>|React.FormEvent<Element>|CustomEvent<Element>) => void;
type LoginError = null|ServerError;

interface FormProps {
  handleSubmit: HandleSubmitMethod,
  email: string,
  emptyEmail: () => string,
  password: string,
  emptyPassword: () => string,
  loginError: LoginError,
}

function getLoginErrorMessage(error: ServerError) {
  switch (error.status) {
    case 401: {
      return 'Your username or password is incorrect.';
    }
    default: {
      return 'An error occured, please contact our team';
    }
  }
}

function renderErrorMessage(error: LoginError) {
  if (error) {
    return (
      <div>
        {getLoginErrorMessage(error)}
      </div>
    );
  }
  return null;
}


const Form = (props: FormProps) => (
  <form onSubmit={props.handleSubmit} className="content connect">
    <div className="loginerror">
      {renderErrorMessage(props.loginError)}
    </div>
    <div className="log">
      <demeter-input-text
        value={props.email}
        identifier="email"
        label="Email"
        error={props.emptyEmail()}
        onKeyPress={(event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            props.handleSubmit(event);
          }
        }}
      />
    </div>
    <div className="pwd">
      <demeter-input-password
        value={props.password}
        identifier="password"
        label="Password"
        error={props.emptyPassword()}
        onKeyPress={(event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            props.handleSubmit(event);
          }
        }}
      />
    </div>
    <div className="otherButtons">
      <div className="remember">
        <demeter-checkbox-group
          identifier="rememberme"
          bubbles={true}
          id="checkboxRemember"
        >
          <demeter-checkbox-item
            identifier="rememberItem"
            id="checkboxRememberItem"
          />
        </demeter-checkbox-group>
        <p>Remember me</p>
      </div>
      <p className="forgot">
        <Link id="forgotLink" to="/login/forgot_password">
          {'Forgot password ?'}
        </Link>
      </p>
    </div>
    <div className="button">
      <demeter-button identifier="submitButton" mode="primary" type="submit">
        Connect
      </demeter-button>
    </div>
  </form>
);

interface Props {
  email: string;
  password: string;
  loginError: LoginError,
  attemptInProgress: boolean;
  setParentState: (key: string, value: string) => void;
  remember: boolean;
  attemptLogin: (
    email: string,
    password: string
  ) => ReturnType<typeof authentActions.attemptLogin>;
}

export class LoginForm extends React.Component<Props, {}> {
  el: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  state = {
    emptyEmail: false,
    emptyPassword: false,
    remember: false,
  };

  handleSubmit: HandleSubmitMethod = (event) => {
    event.preventDefault();

    if (this.checkEmptyFields()) {
      const json = this.buildRequestObject();
      this.props.attemptLogin(json.email, json.password);
    }
  };

  checkEmptyFields = () => {
    const partialState = {
      emptyEmail: !this.props.email,
      emptyPassword: !this.props.password,
    };

    this.setState(state => ({
      ...partialState,
    }));

    return !partialState.emptyEmail && !partialState.emptyPassword;
  };

  buildRequestObject = () => {
    return {
      email: this.props.email,
      password: this.props.password,
    };
  };

  emptyEmail = () => {
    return this.state.emptyEmail ? this.msgEmpty() : '';
  };

  emptyPassword = () => {
    return this.state.emptyPassword ? this.msgEmpty() : '';
  };

  msgEmpty = () => {
    return 'Error this field is empty';
  };

  handleClickForgotPassword = () => {
    this.setState({
      emptyEmail: false,
      emptyPassword: false,
    });
  };

  render() {
    return (
      <>
        <demeter-container>
          <div className="wrapperForm" ref={this.el}>
            <Form
              email={this.props.email}
              password={this.props.password}
              handleSubmit={this.handleSubmit}
              emptyEmail={this.emptyEmail}
              emptyPassword={this.emptyPassword}
              loginError={this.props.loginError}
            />
          </div>
        </demeter-container>
        {this.props.attemptInProgress && (
          <Redirect
            to={{
              pathname: '/login/loading',
            }}
          />
        )}
      </>
    );
  }

  get $el() {
    return this.el.current!;
  }

  onDemeterButtonClick = (event: CustomEvent) => {
    switch (event.detail.identifier) {
      case 'submitButton':
        localStorage.setItem('remember', `${this.state.remember}`);
        return this.handleSubmit(event);
      default:
        return null;
    }
  };

  onDemeterCheckboxChange = (event: CustomEvent) => {
    const remember = event.detail.value.length === 0 ? false : true;
    switch (event.detail.identifier) {
      case 'rememberme':
        this.setState({ remember });
        break;
      default:
        return null;
    }
  };

  onDemeterInputTextChange = (event: CustomEvent) => {
    this.props.setParentState(event.detail.identifier, event.detail.value);
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

    this.$el.addEventListener(
      'demeter-checkbox-group-change',
      this.onDemeterCheckboxChange
    );
  }

  componentWillUnmount() {
    this.$el.removeEventListener(
      'demeter-input-change',
      this.onDemeterInputTextChange
    );
    this.$el.removeEventListener(
      'demeter-button-click',
      this.onDemeterButtonClick
    );
    this.$el.removeEventListener(
      'demeter-checkbox-group-change',
      this.onDemeterCheckboxChange
    );
  }
}

const mapStoreToProps = (store: any) => ({
  loginError: store.authent.user.error,
  attemptInProgress: store.authent.user.requestInProgress,
});

export default connect(
  mapStoreToProps,
  {
    attemptLogin: authentActions.attemptLogin,
  }
)(LoginForm);


export function LoginFormDoc() {
  const [state, setState] = React.useState({
    email: '',
    password: '',
    attemptInProgress: false,
    remember: false,
  });

  return (
    <LoginForm
      email={state.email}
      password={state.password}
      remember={state.remember}
      loginError={null}
      attemptInProgress={state.attemptInProgress}
      setParentState={(key, val) => {
        setState({ ...state, [key]: val })
      }}
      attemptLogin={(email, password) => {
        return authentActions.attemptLogin(email, password);
      }}
    />
  );
}