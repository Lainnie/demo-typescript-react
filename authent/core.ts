import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from '../shared/ajax';
import { catchError, map, retry, switchMap } from 'rxjs/operators';

import getGateway from '../shared/utils/getGateway';
import { WiseSVC, Anesidora } from 'olympus-anesidora';
import { Middleware, AnyAction } from 'redux';
import { Dispatch } from 'redux';
import { useMappedState } from 'redux-react-hook';

import { getPath } from '../shared/utils/paths';

import {
  setUserLastActivityDate,
  isUserActiveWithinTheLast24h,
} from '../shared/userActivityService';

export {
  useCurrentUser,
  useLogout,
  useLoggedOutUser,
  useChangeProfile,
  useProfile,
} from './use';

export enum types {
  ATTEMPT_LOGIN_FAILED = '[authent] ATTEMPT_LOGIN_FAILED',
  ATTEMPT_LOGIN_SUCCEED = '[authent] ATTEMPT_LOGIN_SUCCEED',
  ATTEMPT_LOGIN = '[authent] ATTEMPT_LOGIN',
  ATTEMPT_LOGOUT = '[authent] ATTEMPT_LOGOUT',
  ATTEMPT_LOGOUT_SUCCEED = '[authent] ATTEMPT_LOGOUT_SUCCEED',
  UPDATE_USER_PROFILE = '[authent] UPDATE_USER_PROFILE',
  '@@STORE_READY' = '@@STORE_READY',
}

export enum BusinessEntity {
  RETAILER = 'retailer',
  SALES_HOUSE = 'sales_house',
  BRAND = 'brand',
  AGENCY = 'agency',
}

export const mapStateBusinessEntity = (state: any): BusinessEntity => {
  return state.authent.user.business_entity;
};

export const useBusinessEntity = () => {
  return useMappedState(mapStateBusinessEntity);
};

export function getBusinessEntityLandingRoute(businessEntity: BusinessEntity) {
  if (
    businessEntity === BusinessEntity.SALES_HOUSE ||
    businessEntity === BusinessEntity.RETAILER
  ) {
    return getPath('supply.cockpit');
  }
  return getPath('demand.cockpit');
}

interface UserWithTokens extends WiseSVC.User {
  client_session: string;
  refresh_session: string;
}
interface AttemptResponse {
  user: UserWithTokens;
  business_entity: BusinessEntity;
}

export interface ServerError {
  status: number;
  message: string;
}

const attemptLoginAction = (email: string, password: string) => ({
  payload: {
    email,
    password,
  },
  type: types.ATTEMPT_LOGIN as typeof types.ATTEMPT_LOGIN,
});

const attemptLoginSucceedAction = (payload: AttemptResponse) => ({
  payload,
  type: types.ATTEMPT_LOGIN_SUCCEED as typeof types.ATTEMPT_LOGIN_SUCCEED,
});

const attemptLoginFailedAction = (error: ServerError) => ({
  payload: error,
  type: types.ATTEMPT_LOGIN_FAILED as typeof types.ATTEMPT_LOGIN_FAILED,
});

const attemptLogoutAction = () => ({
  type: types.ATTEMPT_LOGOUT as typeof types.ATTEMPT_LOGOUT,
});

const attemptLogoutSucceedAction = () => ({
  type: types.ATTEMPT_LOGOUT_SUCCEED as typeof types.ATTEMPT_LOGOUT_SUCCEED,
});

const updateUserProfileAction = (profile: UserProfileState) => ({
  payload: profile,
  type: types.UPDATE_USER_PROFILE as typeof types.UPDATE_USER_PROFILE,
});

type AttemptSucceedAction = ReturnType<typeof attemptLoginSucceedAction>;
type AttemptFailedAction = ReturnType<typeof attemptLoginFailedAction>;
type AttemptAction = ReturnType<typeof attemptLoginAction>;
type AttemptLogoutAction = ReturnType<typeof attemptLogoutAction>;
type AttemptLogoutSucceedAction = ReturnType<typeof attemptLogoutSucceedAction>;
type UpdateUserProfileAction = ReturnType<typeof updateUserProfileAction>;

type Actions =
  | AttemptSucceedAction
  | AttemptFailedAction
  | AttemptAction
  | AttemptLogoutAction
  | AttemptLogoutSucceedAction
  | UpdateUserProfileAction;

export const actions = {
  attemptLogin: attemptLoginAction,
  attemptLoginFailed: attemptLoginFailedAction,
  attemptLoginSucceed: attemptLoginSucceedAction,
  attemptLogout: attemptLogoutAction,
  updateUserProfile: updateUserProfileAction,
};

type MenuSituation = 'expanded' | 'collapsed';

export interface UserProfileState {
  menuSituation: MenuSituation;
}

export interface UserState_user extends UserWithTokens {
  username: string;
}

export interface UserState {
  requestInProgress: boolean;
  loggedOut: boolean;
  profile: UserProfileState;
  business_entity: BusinessEntity | null;
  user: UserState_user;
  error: null | ServerError;
}

const userDefaultState: UserState = {
  error: null,
  loggedOut: false,
  profile: {
    menuSituation: 'expanded' as MenuSituation,
  },
  requestInProgress: false,
  business_entity: null,
  user: {
    email: '',
    firstname: '',
    id: '',
    lastname: '',
    language: Anesidora.Language.FR_FR,
    is_admin: false,
    role: '',
    account_id: '',
    active: false,
    client_session: '',
    refresh_session: '',
    username: '',
  },
};

const user = (state: UserState = userDefaultState, action: Actions) => {
  switch (action.type) {
    case types.ATTEMPT_LOGIN:
      return { ...state, requestInProgress: true };
    case types.ATTEMPT_LOGIN_SUCCEED: {
      let username;
      const { user, business_entity } = action.payload;

      if (user.firstname && user.lastname) {
        username = `${user.firstname} ${user.lastname}`;
      } else {
        [username] = user.email ? user.email.split('@') : 'Login';
      }

      return {
        ...state,
        loggedOut: false,
        requestInProgress: false,
        user: { ...user, username },
        business_entity,
      };
    }
    case types.ATTEMPT_LOGIN_FAILED:
      return { ...state, error: action.payload, requestInProgress: false };
    case types.ATTEMPT_LOGOUT_SUCCEED:
      return {
        ...userDefaultState,
        loggedOut: true,
      };
    case types.UPDATE_USER_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const reducers = {
  user,
};

const userMiddleware: Middleware<
  {},
  { authent: { user: UserState } },
  Dispatch<AnyAction>
> = ({ dispatch, getState }) => (next: any) => (action: any) => {
  switch (action.type) {
    case '@@STORE_READY': {
      const storageUser = localStorage.getItem('user');
      const storageBusinessEntity = localStorage.getItem('business_entity');

      const currentUser = storageUser
        ? JSON.parse(storageUser)
        : userDefaultState.user;
      const currentBusinessEntity = storageBusinessEntity
        ? JSON.parse(storageBusinessEntity)
        : userDefaultState.business_entity;

      if (
        localStorage.getItem('remember') === 'true' ||
        isUserActiveWithinTheLast24h()
      ) {
        dispatch(
          attemptLoginSucceedAction({
            user: currentUser,
            business_entity: currentBusinessEntity,
          })
        );
        return next(action);
      }
      break;
    }
    case types.ATTEMPT_LOGIN_SUCCEED: {
      const result = next(action);
      const currentUserState = getState().authent.user;
      setUserLastActivityDate();
      localStorage.setItem('user', JSON.stringify(currentUserState.user));
      localStorage.setItem(
        'business_entity',
        JSON.stringify(currentUserState.business_entity)
      );
      return result;
    }
    case types.ATTEMPT_LOGOUT: {
      localStorage.setItem('user', '{}');
      localStorage.setItem('business_entity', '');
      return next(action);
    }
    default:
      return next(action);
  }
};

export const middlewares = [userMiddleware];

const attemptLogin$: Epic = action$ =>
  action$.pipe(
    ofType(types.ATTEMPT_LOGIN),
    switchMap((action: AttemptAction) =>
      ajax({
        url: getGateway('/gateway/auth'),
        method: 'POST',
        body: {
          email: action.payload.email,
          password: action.payload.password,
        },
        headers: {
          crossDomain: true,
          withCredentials: true,
        },
      }).pipe(
        map(attempt => attemptLoginSucceedAction(attempt.response)),
        retry(2),
        catchError((err, caught) => of(attemptLoginFailedAction(err)))
      )
    )
  );

const attemptLogout$: Epic = (action$, state$) =>
  action$.pipe(
    ofType(types.ATTEMPT_LOGOUT),
    switchMap(() => {
      return ajax({
        url: getGateway('/gateway/auth'),
        method: 'DELETE',
      }).pipe(
        map(() => attemptLogoutSucceedAction()),
        catchError((err, caught) => of(attemptLoginFailedAction(err)))
      );
    })
  );

export const epics = [attemptLogin$, attemptLogout$];
