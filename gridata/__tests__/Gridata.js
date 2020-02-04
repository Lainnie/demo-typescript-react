import * as React from 'react';
import faker from 'faker';

import { render, waitForElement, fireEvent } from 'athena-testing-library';

import { DataTable } from '../DataTable';

const dummyDatum = {
  creative: { name: faker.commerce.productName() },
  insertion: { name: faker.commerce.productName() },
  name: faker.commerce.productName(),
  status: 'LIV',
};

const statusMessage = `Status ${dummyDatum.status}`;

const StatusCell = props => <div>{`Status ${props.value}`}</div>;

const gridOptions = {
  columnDefs: [
    { field: 'name', headerName: 'Campaign Name' },
    { field: 'insertion.name', headerName: 'Insertion Name' },
    {
      field: datum => datum.creative.name,
      fieldParams: { id: 'creativeName' },
      headerName: 'Creative Name',
    },
    {
      cellRenderer: props => <StatusCell {...props} />,
      field: 'status',
      headerName: 'Status',
      renderer: 'status',
    },
  ],
  contextMenuDefs: [{ text: faker.commerce.productName() }],
  onGridReady: jest.fn(),
  rawData: [dummyDatum],
};

test('gridata', async () => {
  const { container, getByText, getByTestId } = render(
    <DataTable gridOptions={gridOptions} />
  );

  // Display header names properly
  getByText('Campaign Name');
  getByText('Insertion Name');
  getByText('Creative Name');
  getByText('Status');

  // Display data properly
  getByText(dummyDatum.name);
  getByText(dummyDatum.insertion.name);
  getByText(dummyDatum.creative.name);
  getByText(statusMessage);

  // Open contextmenu
  fireEvent(container.firstChild, new Event('contextmenu'));

  await waitForElement(() => getByTestId('data-table-menu-test'));
});
