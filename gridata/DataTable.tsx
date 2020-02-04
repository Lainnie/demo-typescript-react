import * as _ from 'lodash';
import * as React from 'react';

import ReactTable from 'react-table';

import { gridata, Gridata, GridOptions, ColumnDef, ContentAlign } from '../gridata';

import { useContextMenu } from './useContextMenu';

import './DataTable.css';

const sizes = {
  large: 250,
  medium: 110,
  small: 40,
};

// TODO: search input
// The component need to receive a Updater function
// Called with match
// SearchUpdater or Updater must be provided, SearchUpdater will have priority

// TODO: sort
// The component need to receive a Updater function
// Called with sorted field
// ColumnDef.sort must be true
// SortUpdater or Updater must be provided, SortUpdater will have priority

// TODO: filter
// The component need to receive a Updater function
// Called with filtered field
// ColumnDef.filter must be true
// FilterUpdater or Updater must be provided, FilterUpdater will have priority

// TODO: pagination
// Not enterily sure how to implement this yet

interface Props<T> {
  gridOptions: GridOptions<T>;
}

interface DataTableHook<T> {
  $el: React.RefObject<HTMLDivElement>;
  $menu: React.RefObject<HTMLDivElement>;
  gridapi: Gridata<T>;
  tableId: string;
  onGridReady: (params: Gridata<T>) => void;
}

interface SearchProps<T> {}

interface SearchHook<T> {
  text: string;
}

export function useSearchUpdater<T>(props: SearchProps<T>): SearchHook<T> {
  return { text: 'toto' };
}

export function useDataTable<T>(props: Props<T>): DataTableHook<T> {
  const gridapi = gridata(props.gridOptions);

  const tableId = `table-id-${new Date().getTime()}`;
  const $el = React.useRef<HTMLDivElement>(null);
  const $menu = React.useRef<HTMLDivElement>(null);

  if (
    props.gridOptions.contextMenuDefs &&
    props.gridOptions.contextMenuDefs.length
  ) {
    useContextMenu({
      $el,
      $menu,
    });
  }

  return {
    $el,
    $menu,
    gridapi,
    onGridReady: props.gridOptions.onGridReady,
    tableId,
  };
}

const contentAlignMappings = {
  [ContentAlign.LEFT]: 'flex-start',
  [ContentAlign.CENTER]: 'center',
  [ContentAlign.RIGHT]: 'flex-end'
}
function getColumnCellStyle<T>(gridColumn: ColumnDef<T>) {
  let style: {
    [cssRule: string]: string,
  } = {
    display: 'flex',
    alignItems: 'center',
    /**
     * CSS as can be seen on Specs:
     https://xd.adobe.com/spec/346ffcb1-3b4a-45b8-72be-51ffc85a3ff8-425e/screen/32d6ef94-01b3-4a2d-9e1b-f5dac1b7aa20/Components-Table/
    */
    padding: '9px 14px',
    fontSize: '14px',
    color: 'var(--color-grey-3)'
  };

  if (gridColumn.contentAlign) {
    style = {
      ...style,
      justifyContent: contentAlignMappings[gridColumn.contentAlign]
    }
  }

  return style;
}

export function DataTable<T>(props: Props<T>) {
  const { $el, $menu, gridapi, onGridReady, tableId } = useDataTable(props);

  React.useEffect(() => {
    onGridReady && onGridReady(gridapi);
  }, []);

  function getColumns() {
    return _.map(gridapi.api.getColumns(), gridColumn => {
      const width: number = sizes[gridColumn.width || 'medium'];

      return {
        Cell: gridColumn.cellRenderer,
        Header: gridColumn.headerName,
        accessor: gridColumn.field,
        id: gridColumn.fieldParams && gridColumn.fieldParams.id,
        minWidth: width,
        style: getColumnCellStyle(gridColumn),
      };
    });
  }

  return (
    <div id={tableId} className="data-table" ref={$el}>
      <ReactTable
        className="-striped"
        data={gridapi.api.getData()}
        columns={getColumns()}
        showPageSizeOptions={false}
        showPagination={false}
        minRows={1}
      />
      <div className="data-table-menu" ref={$menu} />
    </div>
  );
}
