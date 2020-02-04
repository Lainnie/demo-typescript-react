interface CockpitState {
  ready: boolean;
}

interface Action {
  type: string;
}

const cockpitDefaultState = {
  ready: false,
};

const cockpit = (state: CockpitState = cockpitDefaultState, action: Action) => {
  switch (action.type) {
    case 'SOMETHING':
      return state;
    default:
      return state;
  }
};

export const reducers = {
  cockpit,
};
