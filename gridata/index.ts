import * as _ from 'lodash';

type ColumnWidth = 'small' | 'medium' | 'large';


interface ColumnDefaultDef {
  /* render props component for custom cell */
  cellRenderer?: (props: any) => any;
  /* label/header for the column */
  headerName: string;
  /* enum for choosing the render engine/component */
  renderer?: string;
  /* enum for the column size */
  width?: ColumnWidth;
}

type AccessorFunction<T> = (datum: T) => any;

export enum ContentAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
};

export interface ColumnDef<T> extends ColumnDefaultDef {
  contentAlign?: ContentAlign;
  /* key for the data used by the cell */
  field: string | AccessorFunction<T>;
  /* params for customizing fields */
  fieldParams?: {
    /* whether or not the column can be filtered */
    filter: boolean;
    /* When using an AccessorFunction provide an identifier */
    id?: string;
    /* when to field does not match the field from the backend */
    remoteKey?: string;
    /* whether or not the column can be sorted */
    sort: boolean;
  };
}

interface GridColumnApi<T> {}

export interface GridApi<T> {
  getData: () => T[];
  getColumns: () => ColumnDef<T>[];
}

export interface Gridata<T> {
  api: GridApi<T>;
  columnApi: GridColumnApi<T>;
}

interface ContextMenuDef<T> {
  text: string;
}

export interface GridOptions<T> {
  /* list fo column definition */
  columnDefs: ColumnDef<T>[];
  /* data use in the grid */
  rawData: T[];
  /* callback when the grid is ready, this is where the apis can be retrieved */
  onGridReady: (params: Gridata<T>) => void;
  /* function use to start search request/operation */
  searchUpdater?: (match: string) => void;
  /* context menu definitions for custom right click */
  contextMenuDefs?: ContextMenuDef<T>[];
}

function gridApi<T>(gridOptions: GridOptions<T>): GridApi<T> {
  const defaultColumnDef: Partial<ColumnDef<T>> = {
    fieldParams: { sort: false, filter: false },
    renderer: 'default',
    width: 'medium',
    contentAlign: ContentAlign.LEFT,
  };

  return {
    getData() {
      return gridOptions.rawData;
    },
    getColumns() {
      return _.map(gridOptions.columnDefs, column => ({
        ...defaultColumnDef,
        ...column,
      }));
    },
  };
}

function gridColumnApi<T>(gridOptions: GridOptions<T>): GridColumnApi<T> {
  return {} as GridColumnApi<T>;
}

export function gridata<T>(gridOptions: GridOptions<T>): Gridata<T> {
  const api: GridApi<T> = gridApi(gridOptions);
  const columnApi: GridColumnApi<T> = gridColumnApi(gridOptions);
  const apis = {
    api,
    columnApi,
  };

  return apis;
}
