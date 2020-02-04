import * as React from 'react';

import { useLogout } from './core';

import { useRedirect } from '../shared/use';

const Logout = () => {
  const attemptLogout = useLogout();
  const [redirect, setRedirect] = useRedirect();

  React.useEffect(() => {
    attemptLogout();

    setRedirect('/login', false);
  }, []);

  return redirect;
};

export default Logout;
