import * as _ from 'lodash';
import * as React from 'react';

import { fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';

import { useRedirect } from '.';
import { getPath } from '../utils/paths';

interface ShortcutAction {
  [key: string]: () => void;
}

interface AvailableShortcuts {
  s: ShortcutAction;
  d: ShortcutAction;

  [key: string]: ShortcutAction;
}

function useShortcuts() {
  const availableShortcuts: AvailableShortcuts = {
    s: {
      h: shortcutSupplyCockpit,
      l: shortcutSupplyLineItems,
      r: shortcutSupplyReports,
      b: shortcutSupplyBilling,
      a: shortcutSupplyAdministration,
    },
    d: {
      h: shortcutDemandCockpit,
      c: shortcutDemandCampaigns,
      r: shortcutDemandReports,
      a: shortcutDemandAdministration,
      n: shortcutDemandNewCampaign,
    },
    g: {
      l: shortcutLogin,
      o: shortcutLogout,
    },
  };
  const [redirect, setRedirect] = useRedirect();

  React.useEffect(() => {
    const masterKeys = _.keys(availableShortcuts);
    const supplyKeys = _.keys(availableShortcuts.s);
    const demandKeys = _.keys(availableShortcuts.d);
    const generalKeys = _.keys(availableShortcuts.g);
    const shortcuts = fromEvent(document, 'keydown').pipe(
      scan((shortcut: [boolean, string, string], event: KeyboardEvent) => {
        const [leader, univers] = shortcut;

        // @ts-ignore
        if (event.target.tagName === 'INPUT') {
          return [];
        }

        if (leader && univers === 's' && _.includes(supplyKeys, event.key)) {
          return [leader, univers, event.key];
        } else if (
          leader &&
          univers === 'd' &&
          _.includes(demandKeys, event.key)
        ) {
          return [leader, univers, event.key];
        } else if (
          leader &&
          univers === 'g' &&
          _.includes(generalKeys, event.key)
        ) {
          return [leader, univers, event.key];
        } else if (leader && _.includes(masterKeys, event.key)) {
          return [true, event.key];
        } else if (event.key === ';') {
          return [true];
        } else {
          return [];
        }
      }, [])
    );
    const sub$ = shortcuts.subscribe(
      ([_shortcut, univers, action]: [boolean, string, string]) =>
        availableShortcuts[univers] &&
        availableShortcuts[univers][action] &&
        availableShortcuts[univers][action]()
    );

    return () => {
      sub$.unsubscribe();
    };
  }, []);

  function shortcutLogin() {
    shortcutRedirect('auth.login');
  }

  function shortcutLogout() {
    shortcutRedirect('auth.logout');
  }

  function shortcutSupplyCockpit() {
    shortcutRedirect('supply.cockpit');
  }

  function shortcutSupplyLineItems() {
    shortcutRedirect('supply.lineItem');
  }

  function shortcutSupplyReports() {
    shortcutRedirect('supply.reports');
  }

  function shortcutSupplyBilling() {
    shortcutRedirect('supply.billing');
  }

  function shortcutSupplyAdministration() {
    shortcutRedirect('supply.administration.root');
  }

  function shortcutDemandCockpit() {
    shortcutRedirect('demand.cockpit');
  }

  function shortcutDemandCampaigns() {
    shortcutRedirect('demand.campaigns');
  }

  function shortcutDemandAdministration() {
    shortcutRedirect('demand.administration');
  }

  function shortcutDemandReports() {
    shortcutRedirect('demand.reports');
  }

  function shortcutDemandNewCampaign() {
    shortcutRedirect('demand.workflow.newCampaign');
  }

  function shortcutRedirect(pattern: string) {
    const path = getPath(pattern);

    if (location.pathname.indexOf(path) === -1) {
      setRedirect(path);
    }
  }

  return redirect;
}

export default useShortcuts;
