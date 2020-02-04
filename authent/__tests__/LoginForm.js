import * as React from 'react';
import { render, fireEvent, waitForElement } from 'athena-testing-library';

import { LoginForm } from '../LoginForm';

class Wrapper extends React.Component {
  state = {
    email: 'l.toto@yourhost.com',
    password: '',
  };

  setParentState = (key, value) => {
    // @ts-ignore
    this.setState(state => ({
      [key]: value,
    }));
  };

  render() {
    return (
      <LoginForm
        {...this.props}
        {...this.state}
        setParentState={this.setParentState}
      />
    );
  }
}

test('Submit form', async () => {
  const attemptLogin = jest.fn();
  const email = 'q.user@yourhost.com';
  const password = 'sekrette';

  const { getByDemeterLabel, getByDemeterIdentifier } = render(
    <Wrapper attemptLogin={attemptLogin} />,
    {
      route: '/login',
    }
  );

  fireEvent.demeterInputChange(
    await waitForElement(() => getByDemeterLabel('Email')),
    {
      detail: { value: email, identifier: 'email' },
    }
  );

  fireEvent.demeterInputChange(
    await waitForElement(() => getByDemeterLabel('Password')),
    {
      detail: { value: password, identifier: 'password' },
    }
  );

  fireEvent.demeterButtonClick(getByDemeterIdentifier('submitButton'), {
    detail: { identifier: 'submitButton' },
  });

  expect(attemptLogin).toHaveBeenCalledWith(email, password);
});
