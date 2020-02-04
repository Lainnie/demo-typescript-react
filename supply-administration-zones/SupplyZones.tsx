import * as _ from 'lodash';
import * as React from 'react';
import './SupplyZones.css';

import {
  epics,
  reducers,
  useGetAllZones,
  useZones,
  useUpdateZone,
} from './core';

import { SwitchCell, TextCell } from '../gridata/cells';
import { DataTable } from '../gridata/DataTable';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Validation from '../shared/Validation/Validation';
import { useEvent, useRegisterForStore } from '../shared/use';
import { ucFirst } from '../shared/utils';
import { useRetailerHeader } from '../supply/core';
import { GridOptions } from '../gridata';

interface Props {
  children: any;
}

interface typeRawData {
  activation: {
    value: string;
    universe: string;
    filter: string;
  };
  guarantee: {
    label: string;
    disabled: boolean;
  };
  noGuarantee: {
    value: string;
    filter: string;
    universe: string;
    disabled: boolean;
  };
  zones: {
    label: string;
    id: string;
    value: string;
  };
}

interface compareData {
  id?: string;
  zone_type: string;
  enabled: boolean;
  non_guaranteed_enabled: boolean;
  name?: string;
}

let arraySaveData: [] | typeRawData[] = [];
let arrayOriginalData: compareData[] = [];
let arrayVarianceData: compareData[] = [];
let saveData: compareData[] = [];

const SupplyZones = (props: Props) => {
  const updateZone = useUpdateZone();
  const zoneList = useZones();
  const getZones = useGetAllZones();
  const refEl = React.useRef(null);
  const { currentRetailer, Header } = useRetailerHeader();
  const retailerSelected = currentRetailer.id;
  const [originalData, setOriginalData] = React.useState([] as compareData[]);
  const [gridOptions, setGridOptions] = React.useState({
    columnDefs: [
      {
        field: 'zones',
        headerName: 'Zones',
        cellRenderer: (props: any) => <TextCell {...props} />,
        // contentAlign: ContentAlign.RIGHT,
      },
      {
        cellRenderer: (props: any) => (
          <SwitchCell handlerChange={handlerSwitchCellChange} {...props} />
        ),
        field: 'activation',
        headerName: 'Activation',
        renderer: 'activation',
      },
      {
        field: 'guarantee',
        headerName: 'Guarantee',
        cellRenderer: (props: any) => <TextCell {...props} />,
      },
      {
        cellRenderer: (props: any) => (
          <SwitchCell handlerChange={handlerSwitchCellChange} {...props} />
        ),
        field: 'noGuarantee',
        headerName: 'No Guarantee',
        renderer: 'noGuarantee',
      },
    ],
    contextMenuDefs: [{ text: 'contextMenu Text' }],
    onGridReady: () => {
      return;
    },
    rawData: [],
  } as GridOptions<any>);

  useRegisterForStore({
    epics,
    identifier: 'supplyZones',
    reducers,
  });

  useEvent({
    eventType: 'demeter-button-click',
    onHandler: handlerButtonClick,
    refEl,
  });

  React.useEffect(() => {
    getZones();
  }, []);

  React.useEffect(
    () => {
      const newOriginalData = _.filter(
        zoneList,
        zone => zone.retailer_id === retailerSelected
      );

      setOriginalData(newOriginalData);
      arrayOriginalData = newOriginalData;
    },
    [retailerSelected, zoneList]
  );

  React.useEffect(
    () => {
      const rawData = _.map(originalData, datum => {
        const zones = ucFirst(datum.zone_type);
        const label = datum.name
          ? ucFirst(datum.name)
          : ucFirst(datum.zone_type);
        const disabled = !datum.enabled;

        return {
          activation: {
            value: `${datum.enabled}`,
            universe: 'supply',
            filter: `${datum.zone_type}-activation`,
          },
          guarantee: {
            label: 'Activated',
            disabled,
          },
          noGuarantee: {
            value: `${datum.non_guaranteed_enabled}`,
            filter: `${datum.zone_type}-nonGuaranteed`,
            universe: 'supply',
            disabled,
          },
          zones: {
            label: label,
            id: datum.id!,
            value: zones,
          },
        };
      });

      arraySaveData = rawData;
      setGridOptions({
        ...gridOptions,
        rawData,
      });
      reformatData();
    },
    [originalData]
  );

  const handlerSwitchCellChange = (event: CustomEvent) => {
    event.stopPropagation();
    event.stopImmediatePropagation();

    const [zone_type, field] = event.detail.identifier.split('-');

    setOriginalData(oldOriginalData =>
      _.map(oldOriginalData, datum => {
        if (datum.zone_type !== zone_type) {
          return datum;
        }

        if (field === 'activation') {
          const activationNonGuaranteed =
            event.detail.isActive === false
              ? false
              : datum.non_guaranteed_enabled;
          return {
            ...datum,
            enabled: event.detail.isActive,
            non_guaranteed_enabled: activationNonGuaranteed,
          };
        }

        return {
          ...datum,
          non_guaranteed_enabled: event.detail.isActive,
        };
      })
    );
  };

  function handlerButtonClick(event: CustomEvent) {
    if (event.detail.identifier === 'save') {
      if (arrayVarianceData.length !== 0) {
        arrayVarianceData.forEach(zone => {
          updateZone(zone);
        });
        arrayOriginalData = saveData;

        document.dispatchEvent(new CustomEvent('deactivate-validation', {}));
      }
    } else if (event.detail.identifier === 'annulation') {
      setOriginalData(arrayOriginalData);
    }
    event.stopPropagation();
  }

  const reformatData = () => {
    const reformatOriginalData: compareData[] = arrayOriginalData.map(
      (datum: compareData) => {
        return {
          id: datum.id,
          zone_type: ucFirst(datum.zone_type),
          enabled: datum.enabled,
          non_guaranteed_enabled: datum.non_guaranteed_enabled,
        };
      }
    );
    const reformatSaveData: compareData[] = _.map(
      arraySaveData,
      (datum: typeRawData) => {
        const enabled = datum.activation.value === 'true' ? true : false;
        const non_guaranteed_enabled =
          datum.noGuarantee.value === 'true' ? true : false;
        return {
          id: datum.zones.id,
          zone_type: datum.zones.value,
          enabled,
          non_guaranteed_enabled,
        };
      }
    );

    confrontData(reformatOriginalData, reformatSaveData);
  };

  const confrontData = (original: compareData[], save: compareData[]) => {
    const variance: compareData[] = _.differenceWith(save, original, _.isEqual);
    if (variance.length !== 0) {
      arrayVarianceData = variance;
      saveData = save;
      document.dispatchEvent(new CustomEvent('activate-validation', {}));
    } else if (variance.length === 0) {
      document.dispatchEvent(new CustomEvent('deactivate-validation', {}));
    }
  };

  const children = (childrenProps: Props) => {
    return (
      <React.Fragment>
        <div id="container-title" className="column-1-7">
          <Title>Zones - {currentRetailer.name} </Title>
          <p id="subTitle">
            Define the zones of your website you want to modelize, and the
            allowed types of deal.
          </p>
        </div>
        <demeter-container
          style={{
            '--color-primary': 'var(--color-supplyUniverse-primary)',
          }}
          bodypadding={false}
          class="container-general column-1-7"
          label="Activation per zones"
        >
          <div className="grid-content" slot="">
            <div className="column-1-7 information">
              <DataTable gridOptions={gridOptions} />
            </div>
          </div>
        </demeter-container>
      </React.Fragment>
    );
  };

  const headerChildren = (headerProps: Props) => <Header />;

  const validationChildren = (validationProps: Props) => <Validation />;

  return (
    <AthenaDocumentTitle pageName="Supply Zones">
      <div ref={refEl} className="full-height">
        <Content
          contentClass="supplyzones"
          contentChildren={children}
          headerChildren={headerChildren}
          validationChildren={validationChildren}
        />
      </div>
    </AthenaDocumentTitle>
  );
};

export default SupplyZones;
