import * as React from 'react';

import PageLoading from '../PageLoading';

const useLoading = () => {
  let waitingPeriod: number;

  if (process.env.NODE_ENV === 'test') {
    waitingPeriod = 10;
  } else {
    waitingPeriod = 1000;
  }

  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setWaiting(false);
    }, waitingPeriod);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return waiting ? <PageLoading /> : null;
};

export default useLoading;
