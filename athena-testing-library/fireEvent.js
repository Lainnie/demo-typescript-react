import { fireEvent } from 'react-testing-library';
import each from 'lodash/each';

const eventMap = {
  demeterButtonClick: {
    EventType: 'demeter-button-click',
    defaultInit: {
      bubbles: true,
      cancelable: true,
    },
  },
  demeterInputChange: {
    EventType: 'demeter-input-change',
    defaultInit: {
      bubbles: true,
      cancelable: true,
    },
  },
};

each(eventMap, (config, eventMethodName) => {
  fireEvent[eventMethodName] = (node, init) => {
    const event = new CustomEvent(config.EventType, {
      ...config.defaultInit,
      ...init,
    });

    return fireEvent(node, event);
  };
});

export default fireEvent;
