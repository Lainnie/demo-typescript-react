import * as React from 'react';

import { useDispatch, useMappedState } from 'redux-react-hook';

import { actions, UserProfileState } from './core';

const userMapState = (store: any) => ({
  user: store.authent.user.user,
});

const loggedOutMapState = (store: any) => ({
  loggedOut: store.authent.user.loggedOut,
});

const profileMapState = (store: any) => ({
  profile: store.authent.user.profile,
});

export const useCurrentUser = () => {
  const state = useMappedState(userMapState);

  return state.user;
};

export const useLoggedOutUser = () => {
  const state = useMappedState(loggedOutMapState);

  return state.loggedOut;
};

export const useProfile = () => {
  const state = useMappedState(profileMapState);

  return state.profile;
};

export const useChangeProfile = () => {
  const dispatch = useDispatch();

  return React.useCallback(
    (profile: UserProfileState) => dispatch(actions.updateUserProfile(profile)),
    []
  );
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return React.useCallback(() => dispatch(actions.attemptLogout()), []);
};
