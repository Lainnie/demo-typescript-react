import * as React from 'react';

import { render, fireEvent, waitForElement } from 'athena-testing-library';

import Demand from '../Demand';

const visitPage = async ({ queries, variables }) => {
  const { getByDemeterAlt, getByText } = queries;
  const { identifier, title, node } = variables;
  const titlePattern = new RegExp(title, 'i');
  
  fireEvent.demeterButtonClick(node, {
    detail: { identifier },
  });
  await waitForElement(() => getByDemeterAlt('global-spinner'));
  await waitForElement(() => getByText(titlePattern));
  expect(node).toHaveAttribute('active', 'true');
};

test('menu contains demand links', async () => {
  const { getByDemeterIdentifier, getByDemeterAlt, getByText } = render( <Demand /> );
  const queries = { getByDemeterIdentifier, getByDemeterAlt, getByText };

  // Navigation buttons
  const cockpit = getByDemeterIdentifier('menu-cockpit');
  const reports = getByDemeterIdentifier('menu-reports');
  const campaigns = getByDemeterIdentifier('menu-campaigns');
  const administration = getByDemeterIdentifier('menu-administration');

  const data = [
    {
      queries,
      variables: {
        identifier: 'menu-cockpit',
        node: cockpit,
        title: 'supply cockpit',
      },
    },
    {
      queries,
      variables: {
        identifier: 'menu-reports',
        node: reports,
        title: 'supply reports',
      },
    },
    {
      queries,
      variables: {
        identifier: 'menu-campaigns',
        node: campaigns,
        title: 'supply campaigns',
      },
    },
    {
      queries,
      variables: {
        identifier: 'menu-administration',
        node: administration,
        title: 'supply administration',
      },
    },
  ];

  data.forEach(datum => {
    visitPage(datum);
  });

  // Setting buttons
  getByDemeterIdentifier('menu-user-settings');
});
