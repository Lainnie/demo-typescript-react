import * as utils from '../shared/utils';

const NAMESPACE = 'app';

export const types = utils.keymirror(NAMESPACE, ['CHANGE_UNIVERS']);

type Univers = 'supply' | 'demand';


interface AppState {
  ready: boolean;
  univers: Univers;
}

interface Action {
  type: string;
}

const appDefaultState = {
  ready: false,
  univers: 'univers' as Univers,
};

export const actions = {
  changeUnivers: { type: '' },
};

const app = (state: AppState = appDefaultState, action: Action) => {
  switch (action.type) {
    case types.CHANGE_UNIVERS: {
      const univers = state.univers === 'demand' ? 'supply' : 'demand';

      return {
        ...state,
        univers,
      };
    }
    default:
      return state;
  }
};

export const reducers = {
  main: app,
};
