import * as _ from 'lodash';

import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  epics as authentEpics,
  middlewares as authentMiddlewares,
  reducers as authent,
} from '../authent/core';
import { reducers as app } from './core';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  app: combineReducers(app),
  authent: combineReducers(authent),
});

const epicMiddleware = createEpicMiddleware();

const epic$ = new BehaviorSubject(combineEpics(...authentEpics));

const rootEpic = (action$: any, state$: any) =>
  epic$.pipe(mergeMap((epic: any) => epic(action$, state$)));

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...authentMiddlewares, epicMiddleware))
);

store.dispatch({ type: '@@STORE_READY' });

// @ts-ignore: #voodoo
epicMiddleware.run(rootEpic);

let dynamicReducers: any = {};
let dynamicEpics: any = {};

document.addEventListener('register-epics', (event: CustomEvent) => {
  const { value: newEpics, identifier } = event.detail;

  if (dynamicEpics[identifier]) {
    return;
  }

  dynamicEpics = {
    ...dynamicEpics,
    [identifier]: newEpics,
  };

  _.each(newEpics, epic => {
    epic$.next(epic);
  });
});

document.addEventListener('register-reducers', (event: CustomEvent) => {
  const { value: newReducers, identifier } = event.detail;

  if (dynamicReducers[identifier]) {
    return;
  }

  dynamicReducers = {
    ...dynamicReducers,
    app: combineReducers(app),
    authent: combineReducers(authent),
    [identifier]:
      typeof newReducers === 'function'
        ? newReducers
        : combineReducers(newReducers),
  };

  store.replaceReducer(combineReducers(dynamicReducers));
  store.dispatch({
    type: `${identifier}/READY`,
  });
});

export default store;
