import * as React from 'react';

import { fromEventPattern, Subscription } from 'rxjs';

import { merge } from 'rxjs/operators';

interface ContextMenuProps {
  $el: React.RefObject<HTMLDivElement>;
  $menu: React.RefObject<HTMLDivElement>;
}

type CustomEventHandler = (e: CustomEvent) => void;

export function useContextMenu(props: ContextMenuProps) {
  React.useEffect(
    () => {
      if (!props.$el.current) {
        return;
      }

      const $el = props.$el.current!;
      const $menu = props.$menu.current!;
      const $container = $el.querySelector('.ReactTable') as HTMLDivElement;

      let subContextMenu$!: Subscription;
      let subCloseContextMenu$!: Subscription;

      function openContextMenu(event: MouseEvent) {
        // Wizardry to make sure the contextmenu open in the boundary of the container.
        const containerWidth = $container.clientWidth;
        const menuWidth = $menu.clientWidth;
        const leftPosition = event.clientX - 260;
        const overflow = containerWidth < leftPosition + menuWidth;
        const finalLeftPosition = overflow
          ? containerWidth - menuWidth
          : leftPosition;

        $menu.style.top = `${event.clientY}px`;
        $menu.style.left = `${finalLeftPosition}px`;
        $menu.style.display = 'flex';
        $menu.setAttribute('data-testid', 'data-table-menu-test');
      }

      function closeContextMenu() {
        $menu.style.display = 'none';
        $menu.removeAttribute('data-testid');
      }

      function eventsCloseContextMenu() {
        const clickDom = eventPattern(document, 'click', true);
        const closeContextMenu$ = eventPattern(document, 'contextmenu', true);

        subCloseContextMenu$ = closeContextMenu$
          .pipe(merge(clickDom))
          .subscribe(handleCloseContextMenu);
      }

      function handleContextMenu(event: MouseEvent) {
        event.preventDefault();

        openContextMenu(event);
        setTimeout(() => {
          unsubscribeCloseContextMenu();
          eventsCloseContextMenu();
        }, 0);

        return false;
      }

      function handleCloseContextMenu(event: Event) {
        const $contextmenu = $menu;
        const DO_NOTHING = false;
        const $target: any = event.target!;

        if (hasClickedOn($target, $contextmenu)) {
          return DO_NOTHING;
        }

        if (event.type === 'contextmenu' && hasClickedOn($target, $container)) {
          return DO_NOTHING;
        }

        event.stopPropagation();
        event.stopImmediatePropagation();

        closeContextMenu();
        unsubscribeCloseContextMenu();

        return false;
      }

      function hasClickedOn($clicked: Node & ParentNode, $boundary: Node) {
        do {
          if ($clicked === $boundary) {
            return true;
          }

          // @ts-ignore
          $clicked = $clicked.parentNode;
        } while ($clicked);

        return false;
      }

      function eventPattern(
        dom: any,
        eventType: string,
        capture: boolean = false
      ) {
        return fromEventPattern(
          (handler: CustomEventHandler) =>
            dom.addEventListener(eventType, handler, capture),
          (handler: CustomEventHandler) =>
            dom.removeEventListener(eventType, handler, capture)
        );
      }

      function eventsContextMenu() {
        const rightClick$ = eventPattern($el, 'contextmenu');

        subContextMenu$ = rightClick$.subscribe(handleContextMenu);
      }

      function unsubscribeCloseContextMenu() {
        if (subCloseContextMenu$) {
          subCloseContextMenu$.unsubscribe();
        }
      }

      function unsubscribeContextMenu() {
        if (subContextMenu$) {
          subContextMenu$.unsubscribe();
        }
      }

      eventsContextMenu();

      return () => {
        unsubscribeCloseContextMenu();
        unsubscribeContextMenu();
      };
    },
    [props.$el]
  );
}
