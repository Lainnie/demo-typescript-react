import { History } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import * as Loadable from 'react-loadable';
import { RouteProps } from 'react-router-dom';

import { epics, reducers } from './core';

import { useUnivers } from '../shared/use';

import PageLoading from '../shared/PageLoading';

import { getPath } from '../shared/utils/paths';

import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';

import { ContextRetailerProvider } from './use/ContextRetailer';

import {
  default as Base,
  Navigation,
  Option,
  Setting,
} from '../shared/Layout/Base';

import './Supply.css';
import { useBusinessEntity, BusinessEntity } from '../authent/core';

const SupplyCockpit = Loadable({
  delay: 200,
  loader: () => import('../supply-cockpit/SupplyCockpit'),
  loading: props => <PageLoading {...props} />,
});

const SupplyLineItem = Loadable({
  delay: 200,
  loader: () => import('../supply-line-item/SupplyLineItem'),
  loading: props => <PageLoading {...props} />,
});

const SupplyReports = Loadable({
  delay: 200,
  loader: () => import('../supply-reports/SupplyReports'),
  loading: props => <PageLoading {...props} />,
});

const SupplyBilling = Loadable({
  delay: 200,
  loader: () => import('../supply-billing/SupplyBilling'),
  loading: props => <PageLoading {...props} />,
});

const SupplyAdministration = Loadable({
  delay: 200,
  loader: () => import('../supply-administration/SupplyAdministration'),
  loading: props => <PageLoading {...props} />,
});

const SupplyAdministrationFormats = Loadable({
  delay: 200,
  loader: () =>
    import('../supply-administration-formats/SupplyAdministrationFormats'),
  loading: props => <PageLoading {...props} />,
});

const SupplyAdministrationInventoryPrices = Loadable({
  delay: 200,
  loader: () =>
    import('../supply-administration-inventory-prices/SupplyAdministrationInventoryPrices'),
  loading: props => <PageLoading {...props} />,
});

const SupplyZones = Loadable({
  delay: 200,
  loader: () => import('../supply-administration-zones/SupplyZones'),
  loading: props => <PageLoading {...props} />,
});

const defaultNavigations: Option<Navigation>[] = [
  {
    extras: { path: getPath('supply.cockpit') },
    icon: 'tachometer-alt',
    identifier: 'menu-cockpit',
    name: 'cockpit',
  },
  {
    extras: { path: getPath('supply.lineItem') },
    icon: 'tv-retro',
    identifier: 'menu-line-item',
    name: 'Live Campaigns',
  },
  {
    extras: { path: getPath('supply.reports') },
    icon: 'chart-pie',
    identifier: 'menu-reports',
    name: 'reports',
  },
  {
    extras: { path: getPath('supply.billing') },
    icon: 'gavel',
    identifier: 'menu-billing',
    name: 'billing',
  },
  {
    extras: { path: getPath('supply.administration.root') },
    icon: 'abacus',
    identifier: 'menu-administration',
    name: 'administration',
  },
];

const defaultSettings: Option<Setting>[] = [
  {
    extras: {},
    icon: 'user-circle',
    identifier: 'menu-user-settings',
    name: 'Username / Supply',
  },
  {
    extras: {},
    icon: 'sign-out-alt',
    identifier: 'menu-sign-out',
    name: 'Sign out',
  },
];

const defaultRoutes: RouteProps[] = [
  {
    component: SupplyCockpit,
    exact: true,
    path: getPath('supply.cockpit'),
  },
  {
    component: SupplyLineItem,
    exact: true,
    path: getPath('supply.lineItem'),
  },
  {
    component: SupplyReports,
    exact: true,
    path: getPath('supply.reports'),
  },
  {
    component: SupplyBilling,
    exact: true,
    path: getPath('supply.billing'),
  },
  {
    component: SupplyAdministration,
    exact: true,
    path: getPath('supply.administration.root'),
  },
  {
    component: SupplyZones,
    exact: true,
    path: getPath('supply.administration.zones'),
  },
  {
    component: SupplyAdministrationFormats,
    exact: true,
    path: getPath('supply.administration.formats'),
  },
  {
    component: SupplyAdministrationInventoryPrices,
    exact: true,
    path: getPath('supply.administration.inventoryPrices'),
  },
];

interface Props {
  history: History;
  navigations: Option<Navigation>[];
  settings: Option<Setting>[];
  routes: RouteProps[];
  children: React.ReactNode;
}

const Supply = ({
  history,
  navigations = defaultNavigations,
  routes = defaultRoutes,
  settings = defaultSettings,
}: Props) => {
  const { user, getRoutes, refEl, redirect } = useUnivers({
    epics,
    reducers,
    routes,
    switchRedirect: getPath('demand.cockpit'),
    univers: 'supply',
  });
  const businessEntity = useBusinessEntity();
  let localSettings = [...settings];

  // Can be hooked
  const menuUserSetting = _.find(
    localSettings,
    setting => setting.identifier === 'menu-user-settings'
  )!;
  menuUserSetting.name = `${user.username} / Supply`;

  // BRAND & AGENCY are not allowed to switch between universes
  if (
    businessEntity === BusinessEntity.BRAND ||
    businessEntity === BusinessEntity.AGENCY
  ) {
    localSettings = localSettings.filter(
      setting => setting.identifier !== 'menu-user-settings'
    );
  }

  return (
    <ContextRetailerProvider>
      <AthenaDocumentTitle pageName="Supply">
        <div className="univers supply" ref={refEl}>
          <>
            {redirect}
            <Base
              history={history}
              navigations={navigations}
              settings={localSettings}
            >
              {getRoutes()}
            </Base>
          </>
        </div>
      </AthenaDocumentTitle>
    </ContextRetailerProvider>
  );
};

export default Supply;
