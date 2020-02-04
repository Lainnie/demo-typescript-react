import * as React from 'react';

// @ts-ignore: Unreachable code error
let ContextRetailer = React.createContext();

let initialState = {
  retailer: {
    id: ''
  },
};

let reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'set-retailer':
      return { ...state, retailer: action.payload };
    default:
      break;
  }
};

function ContextRetailerProvider(props: any) {
  let [contextRetailerState, contextRetailerDispatch] = React.useReducer(reducer, initialState);
  let value = { contextRetailerState, contextRetailerDispatch };

  return (
    <ContextRetailer.Provider value={value}>
      {props.children}
    </ContextRetailer.Provider>
  );
}

let ContextRetailerConsumer = ContextRetailer.Consumer;

export { ContextRetailer, ContextRetailerProvider, ContextRetailerConsumer };
