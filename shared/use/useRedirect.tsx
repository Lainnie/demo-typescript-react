import * as React from 'react';

import { Redirect } from 'react-router-dom';

type ReturnUseRedirect = [
  React.ReactNode,
  ((to: string, push?: boolean) => void)
];

const useRedirect = (): ReturnUseRedirect => {
  const [redirect, setRedirect] = React.useState(null as React.ReactNode);

  const useRouterRedirect = (to: string, push = true) => {
    setRedirect(<Redirect to={to} push={push} />);
  };

  return [redirect, useRouterRedirect];
};

export default useRedirect;
