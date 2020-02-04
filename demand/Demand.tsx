import { History } from 'history';
import { RouteProps, Switch } from 'react-router-dom';
import * as _ from 'lodash';
import * as React from 'react';
import * as Loadable from 'react-loadable';

import { epics, reducers } from './core';

import { useUnivers } from '../shared/use';

import { getPath } from '../shared/utils/paths';

import PageLoading from '../shared/PageLoading';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';

import {
  default as Base,
  Navigation,
  Option,
  Setting,
} from '../shared/Layout/Base';

import './Demand.css';
import { useBusinessEntity, BusinessEntity } from '../authent/core';
import {
  withSearchParams,
  enhanceRouteComponent,
  withFormMode,
} from '../shared/routing';

const DemandReports = Loadable({
  delay: 200,
  loader: () => import('../demand-reports/DemandReports'),
  loading: props => <PageLoading {...props} />,
});

const DemandCockpit = Loadable({
  delay: 200,
  loader: () => import('../demand-cockpit/DemandCockpit'),
  loading: props => <PageLoading {...props} />,
});

const DemandFunding = Loadable({
  delay: 200,
  loader: () => import('../demand-funding/DemandFunding'),
  loading: props => <PageLoading {...props} />,
});

const DemandNewCampaign = Loadable({
  delay: 200,
  loader: () => import('../demand-workflow-campaigns/DemandNewCampaign'),
  loading: props => <PageLoading {...props} />,
});

const DemandWorkflowCampaign = Loadable({
  delay: 200,
  loader: () => import('../demand-workflow-campaigns/DemandWorkflowCampaign'),
  loading: props => <PageLoading {...props} />,
});

// @ts-ignore: Loadable can handle hooks, replace with React.Suspence
const DemandCampaigns = Loadable({
  delay: 200,
  loader: () => import('../demand-campaigns/DemandCampaigns'),
  loading: props => <PageLoading {...props} />,
});

const DemandAdministration = Loadable({
  delay: 200,
  loader: () => import('../demand-administration/DemandAdministration'),
  loading: props => <PageLoading {...props} />,
});

const NewDemandWorkflowLineItem = Loadable({
  delay: 200,
  loader: () => import('../demand-workflow-line-items/NewDemandWorkflowLineItem'),
  loading: props => <PageLoading {...props} />,
});

const EditDemandWorkflowLineItem = Loadable({
  delay: 200,
  loader: () => import('../demand-workflow-line-items/EditDemandWorkflowLineItem'),
  loading: props => <PageLoading {...props} />,
});


const defaultNavigations: Option<Navigation>[] = [
  {
    extras: { path: getPath('demand.cockpit') },
    icon: 'tachometer-alt',
    identifier: 'menu-cockpit',
    name: 'cockpit',
  },
  {
    extras: { path: getPath('demand.campaigns') },
    icon: 'tv-retro',
    identifier: 'menu-campaigns',
    name: 'campaigns',
  },
  {
    extras: { path: getPath('demand.reports') },
    icon: 'chart-pie',
    identifier: 'menu-reports',
    name: 'reports',
  },
  {
    extras: { path: getPath('demand.administration') },
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
    name: 'Username / Demand',
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
    component: DemandCockpit,
    exact: true,
    path: getPath('demand.cockpit'),
  },
  {
    component: DemandCampaigns,
    exact: true,
    path: getPath('demand.campaigns'),
  },
  {
    component: DemandReports,
    exact: true,
    path: getPath('demand.reports'),
  },
  {
    component: DemandFunding,
    exact: true,
    path: getPath('demand.funding'),
  },
  {
    component: DemandAdministration,
    exact: true,
    path: getPath('demand.administration'),
  },
  {
    component: DemandNewCampaign,
    exact: true,
    path: getPath('demand.workflow.newCampaign'),
  },
  {
    component: enhanceRouteComponent(withSearchParams)(NewDemandWorkflowLineItem),
    path: getPath('demand.workflow.newLineItem'),
  },
  {
    component: enhanceRouteComponent(withSearchParams)(EditDemandWorkflowLineItem),
    path: getPath('demand.workflow.lineItem'),
  },
  {
    component: DemandWorkflowCampaign,
    path: getPath('demand.workflow.campaign'),
  },
];

interface Props {
  history: History;
  navigations: Option<Navigation>[];
  settings: Option<Setting>[];
  routes: RouteProps[];
  children: React.ReactNode;
}

const Demand = ({
  history,
  navigations = defaultNavigations,
  routes = defaultRoutes,
  settings = defaultSettings,
}: Props) => {
  const { user, getRoutes, refEl, redirect } = useUnivers({
    epics,
    reducers,
    routes,
    switchRedirect: getPath('supply.cockpit'),
    univers: 'demand',
  });
  const businessEntity = useBusinessEntity();
  let localSettings = [...settings];

  // Can be hooked
  const menuUserSetting = _.find(
    localSettings,
    setting => setting.identifier === 'menu-user-settings'
  )!;
  menuUserSetting.name = `${user.username} / Demand`;

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
    <AthenaDocumentTitle pageName="Demand">
      <>
        <div className="univers demand" ref={refEl}>
          <>
            {redirect}
            <Base
              history={history}
              navigations={navigations}
              settings={localSettings}
            >
              <Switch>{getRoutes()}</Switch>
            </Base>
          </>
        </div>
      </>
    </AthenaDocumentTitle>
  );
};

export default Demand;
