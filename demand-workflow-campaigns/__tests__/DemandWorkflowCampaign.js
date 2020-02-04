import * as React from 'react';

import DemandWorkflowCampaign from '../DemandWorkflowCampaign';

import {
  fireEvent,
  fixtures,
  render,
  wait,
  waitForElement,
} from 'athena-testing-library';

const renderComponent = () => {
  const updateCampaign = jest.fn();
  const rendered = render(
    <DemandWorkflowCampaign
      brandList={[fixtures.brand]}
      campaignList={[]}
      lineItemList={[]}
      updateCampaign={updateCampaign}
      getAllBrands={jest.fn()}
      getAllCampaigns={jest.fn()}
      getAllLineItems={jest.fn()}
      loading={null}
      request=""
      requestInProgress={false}
    />,
    { route: '/demand/workflow/campaigns/toto' }
  );

  return {
    ...rendered,
    updateCampaign,
  };
};

test('renders correctly', () => {
  renderComponent();
});

test('fill form', async () => {
  const {
    updateCampaign,
    getByText,
    getByLabelText,
    getByDemeterAlt,
    getByDemeterLabel,
    getByDemeterIdentifier,
    debug,
  } = renderComponent();

  fireEvent.demeterInputChange(
    await waitForElement(() => getByDemeterLabel('Name')),
    {
      detail: { value: 'mycampaign', identifier: 'name' },
    }
  );

  fireEvent.demeterInputChange(getByDemeterLabel('Global Budget'), {
    detail: { value: 1000, identifier: 'global_budget' },
  });

  fireEvent.demeterButtonClick(getByDemeterIdentifier('action-fire'));

  expect(updateCampaign).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'mycampaign',
      global_budget: 1000,
    })
  );
});
