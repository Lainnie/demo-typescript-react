import * as _ from 'lodash';
import * as React from 'react';

import { fromEventPattern } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Props {
  /* handler function, most likely to contains a switch on identifier */
  onHandler: (value: {}) => void;
  /* reference to container handling clicks */
  refEl: React.RefObject<HTMLElement>;
  /* optional selector to restrict propagation scope */
  selector?: string;
  /* event type, default to demeter-button-click */
  eventType?: string;
  /* random value use to trigger a rebind */
  rebind?: any | any[];
  /* debounce time to avoid spamming */
  debounceFor?: number;
}

function myFromEventPattern(
  $el: HTMLElement | Element,
  eventType: string,
  debounceFor: number
) {
  if (process.env.NODE_ENV === 'test') {
    return fromEventPattern(
      (handler: CustomEventHandler) => $el.addEventListener(eventType, handler),
      (handler: CustomEventHandler) =>
        $el.removeEventListener(eventType, handler)
    );
  } else {
    return fromEventPattern(
      (handler: CustomEventHandler) => $el.addEventListener(eventType, handler),
      (handler: CustomEventHandler) =>
        $el.removeEventListener(eventType, handler)
    ).pipe(debounceTime(debounceFor));
  }
}

type CustomEventHandler = (e: CustomEvent) => void;

const useEvent = ({
  onHandler,
  rebind,
  refEl,
  selector,
  eventType = 'demeter-button-click',
  debounceFor = -1,
}: Props) => {
  const rebinds = _.isArray(rebind) ? rebind : [rebind];

  React.useEffect(() => {
    if (!refEl.current) {
      return;
    }
    let $el: HTMLElement | Element;

    if (selector) {
      $el = refEl.current.querySelector(selector)!;
    } else {
      $el = refEl.current;
    }

    if (!$el) {
      return;
    }

    const button$ = myFromEventPattern($el, eventType, debounceFor);
    const subButton$ = button$.subscribe(onHandler);

    return () => {
      subButton$.unsubscribe();
    };
  }, [refEl, ...rebinds]);
};

export default useEvent;
