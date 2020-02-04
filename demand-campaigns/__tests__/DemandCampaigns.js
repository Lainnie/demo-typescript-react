import * as React from 'react';

import {
  act,
  fireEvent,
  fixtures,
  render,
  wait,
  waitForElement,
} from 'athena-testing-library';

import DemandCampaigns from '../DemandCampaigns';

test('renders correctly', async () => {
  const { getByText, queryByText, debug } = render(
    <DemandCampaigns
      brandList={[fixtures.brand]}
      campaignList={fixtures.campaignList}
      getAllBrands={jest.fn()}
      getAllCampaigns={jest.fn()}
      loading={null}
    />,
    { route: '/demand-campaigns' }
  );

  // Display campaigns element
  await waitForElement(() => getByText(/my second campaign/i));

  // Select a brand
  const $brand = getByText(/samsung/i, {
    selector: '.dropdownItemComp',
  });
  fireEvent.click($brand);

  // Title update depending on brand selected
  await waitForElement(() => getByText(/Campaign List - samsung/i));

  // Display campaigns filtered element
  await waitForElement(() => getByText(/mycampaign/i));

  // Do not display campaigns filtered by brand
  await wait(() =>
    expect(queryByText(/my second campaign/i)).not.toBeInTheDocument()
  );
});
