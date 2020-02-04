import { History } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { fromEventPattern } from 'rxjs';
import { merge } from 'rxjs/operators';
import { useEvent } from '../use';
import { useChangeProfile, useProfile } from '../../authent/core';
import { athenaVersion } from '../../shared/constants';
import { isSmallScreen } from '../../shared/responsive';
import { setUserLastActivityDate } from '../../shared/userActivityService';

import './Base.menu.css';
import './Base.page.css';

export interface Option<T> {
  extras: T;
  icon: string;
  identifier: string;
  name: string;
}

export interface Navigation {
  active?: boolean;
  path: string;
}

export interface Setting {}

type OptionType = Navigation | Setting;

type MenuSituation = 'expanded' | 'collapsed';

type CustomEventHandler = (e: CustomEvent) => void;

interface Menu {
  logo: React.ReactNode;
  situation: MenuSituation;
  xs: boolean;
}

interface Situations {
  expanded: Menu;
  collapsed: Menu;

  [key: string]: Menu;
}

interface Props {
  children: React.ReactNode;
  history: History;
  navigations: Option<Navigation>[];
  settings: Option<Setting>[];
}

const collapsed = {
  logo: <demeter-logo alt="logo" title={athenaVersion} />,
  situation: 'collapsed' as MenuSituation,
  xs: true,
};

const expanded = {
  logo: (
    <demeter-large-logo
      alt="logo-large"
      style={{ '--color-tertiary': 'white' }}
      title={athenaVersion}
    />
  ),
  situation: 'expanded' as MenuSituation,
  xs: false,
};

const situations: Situations = {
  collapsed,
  expanded,
};

const useValidation = (refEl: React.RefObject<HTMLDivElement>) => {
  React.useEffect(() => {
    if (!refEl.current) {
      return;
    }

    const $el = refEl.current!;

    const activateValidation$ = fromEventPattern(
      (handler: CustomEventHandler) =>
        document.addEventListener('activate-validation', handler),
      (handler: CustomEventHandler) =>
        document.removeEventListener('activate-validation', handler)
    );

    const deactivateValidation$ = fromEventPattern(
      (handler: CustomEventHandler) =>
        document.addEventListener('deactivate-validation', handler),
      (handler: CustomEventHandler) =>
        document.removeEventListener('deactivate-validation', handler)
    );

    const subValidation$ = activateValidation$
      .pipe(merge(deactivateValidation$))
      .subscribe((event: CustomEvent) => {
        const $validation = $el.querySelector('.validation')!;

        if (!$validation) {
          return;
        }

        if (event.type === 'activate-validation') {
          $validation.classList.add('active');
          $validation.setAttribute('data-testid', 'validation-activated');
        } else {
          $validation.removeAttribute('data-testid');
          $validation.classList.remove('active');
        }
      });

    return () => {
      subValidation$.unsubscribe();
    };
  }, [refEl]);
};

const Base = (props: Props) => {
  const el = React.createRef<HTMLDivElement>();
  const profile = useProfile();
  const updateUserProfile = useChangeProfile();
  const getDefaultMenuSituation = () =>
    isSmallScreen() ? collapsed : situations[profile.menuSituation];
  const [menu, setMenu] = React.useState(getDefaultMenuSituation());
  const [validationChildren, setValidationChildren] = React.useState(() => (
    <div />
  ));

  // Force menu to be collapsed on small screens
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      isSmallScreen()
        ? setMenu(collapsed)
        : setMenu(situations[profile.menuSituation]);
    });
  });

  // Reset user last activity date on anywhere click
  React.useEffect(() => {
    window.addEventListener(
      'click',
      _.throttle(
        () => {
          setUserLastActivityDate();
        },
        2000,
        { trailing: false }
      )
    );
  }, []);

  useValidation(el);

  useEvent({
    eventType: 'click',
    onHandler: setContextMenu,
    refEl: el,
    selector: '.wrapper-demeter-logo',
  });

  useEvent({ refEl: el, onHandler: onDemeterButtonClick });

  function setContextMenu() {
    // menu can expand only on wide screens
    if (!isSmallScreen()) {
      const newSituation = changeSituation(menu);
      updateUserProfile({ menuSituation: newSituation.situation });
      setMenu(newSituation);
      document.dispatchEvent(new CustomEvent('rebind-settings'));
    }
  }

  function getToolip(
    option: Option<OptionType>,
    key: string,
    node: React.ReactNode
  ) {
    if (menu.xs) {
      return (
        <demeter-with-tooltip
          text={option.name}
          position="right"
          key={`menu-tooltip-${key}-${option.identifier}`}
        >
          {node}
        </demeter-with-tooltip>
      );
    }

    return node;
  }

  function getButtons(options: Option<OptionType>[], key: string) {
    return _.map(options, option => {
      const extras = menu.xs ? { xs: true } : {};
      const node = (
        <demeter-menu-button
          key={`menu-${key}-${option.identifier}`}
          class={option.identifier}
          {...option}
          {...extras}
        >
          <demeter-avatar icon={option.icon} />
        </demeter-menu-button>
      );

      return getToolip(option, key, node);
    });
  }

  function setNavigationActive(
    navigations: Option<Navigation>[],
    history: History
  ) {
    return _.map(navigations, navigation => ({
      ...navigation,
      active: _.includes(history.location.pathname, navigation.extras.path),
    }));
  }

  function navigateTo(path: string) {
    props.history.push(path);
  }

  function onDemeterButtonClick(event: CustomEvent) {
    const identifier = event.detail.identifier;
    const navigation = _.find(
      props.navigations,
      option => option.identifier === identifier
    );
    if (navigation) {
      event.stopPropagation();
      return navigateTo(navigation.extras.path);
    }

    return null;
  }

  function changeSituation(currentMenu: Menu) {
    return currentMenu.situation === 'expanded' ? collapsed : expanded;
  }

  const navigationsWithActive = setNavigationActive(
    props.navigations,
    props.history
  );

  return (
    <div ref={el} className="layout-connected">
      <div className={`menu ${menu.situation}`}>
        <demeter-wrapper-menu>
          <div className="wrapper-demeter">
            <div className="wrapper-demeter-logo">{menu.logo}</div>
            <div className="wrapper-demeter-buttons-navigation">
              {getButtons(navigationsWithActive, 'navigation')}
            </div>
            <div className="wrapper-demeter-buttons-settings">
              {getButtons(props.settings, 'setting')}
            </div>
          </div>
        </demeter-wrapper-menu>
      </div>
      <div className="page">
        {props.children}
        {validationChildren}
      </div>
    </div>
  );
};

export default Base;
