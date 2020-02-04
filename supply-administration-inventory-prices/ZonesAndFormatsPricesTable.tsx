import * as _ from 'lodash';
import * as React from 'react';
import { DataTable } from '../gridata/DataTable';
import { capitalize } from './core';
import { ZoneWithFormats } from './core';
import { useEvent } from '../shared/use';

const emptyPrice = {
  guaranteedPrice: '',
  nonGuaranteedPrice: '',
  archived: false,
};

const PlusSign = () => <div style={{ paddingRight: '20px' }}>+ </div>;

const addPrices = (priceA: any, priceB: any, key: string) => {
  if (
    priceA &&
    priceA[key] &&
    priceA[key] !== '' &&
    !isNaN(priceA[key]) &&
    priceB &&
    priceB[key] &&
    priceB[key] !== '' &&
    !isNaN(priceB[key])
  ) {
    return Number(priceA[key]) + Number(priceB[key]);
  }
  return '';
};

const getRawPriceItem = ({
  zoneId,
  formatId,
  name,
  price,
  parentPrice,
  isChild = false,
}: {
  zoneId: string;
  formatId?: string;
  name: string;
  price: any;
  parentPrice?: any;
  isChild?: boolean;
}) => {
  if (price) {
    const guaranteedPriceInputIdentifier = {
      zoneId,
      formatId,
      field: 'guaranteed_price',
    };
    const nonGuaranteedPriceInputIdentifier = {
      zoneId,
      formatId,
      field: 'non_guaranteed_price',
    };
    const guaranteedPrice = price.guaranteed_price;
    const nonGuaranteedPrice = price.non_guaranteed_price;
    const namePrefix = isChild ? '- ' : '';
    const Prefix = ({ isChild }: { isChild: boolean }) => {
      return isChild ? <PlusSign /> : null;
    };
    return {
      name: `${namePrefix}${capitalize(name)}`,
      unitary_price_guarantee: (
        <>
          <Prefix isChild={isChild} />
          <demeter-input-text
            identifier={JSON.stringify(guaranteedPriceInputIdentifier)}
            value={guaranteedPrice}
            style={{ flex: '1' }}
          />
        </>
      ),
      zone_format_price_guarantee: addPrices(
        parentPrice,
        price,
        'guaranteed_price'
      ),
      unitary_price_no_guarantee: (
        <>
          <Prefix isChild={isChild} />
          <demeter-input-text
            identifier={JSON.stringify(nonGuaranteedPriceInputIdentifier)}
            value={nonGuaranteedPrice}
            style={{ flex: '1' }}
          />
        </>
      ),
      zone_format_price_no_guarantee: addPrices(
        parentPrice,
        price,
        'non_guaranteed_price'
      ),
    };
  }
  return null;
};

const getRawData = (zones: ZoneWithFormats[]) => {
  const data: any = [];
  zones.map(zone => {
    data.push(
      getRawPriceItem({
        zoneId: zone.id!,
        name: zone.name,
        price: zone.price || emptyPrice,
      })
    );
    zone.formats.map(format => {
      data.push(
        getRawPriceItem({
          zoneId: zone.id!,
          formatId: format.id,
          name: format.format.template!.name,
          price: format.price || emptyPrice,
          parentPrice: zone.price,
          isChild: true,
        })
      );
      return format;
    });
    return zone;
  });
  return data;
};

const ZonesAndFormatsPricesTable = ({
  zones,
  handleOnDataChange,
}: {
  zones?: ZoneWithFormats[];
  handleOnDataChange: Function;
}) => {
  const refEl = React.useRef(null);
  const [rawData, setRawData] = React.useState([]);

  React.useEffect(() => {
    if (zones) {
      setRawData(getRawData(zones));
    }
  }, [zones]);

  const handleDemeterInputChange = (e: CustomEvent) => {
    const pathToData = JSON.parse(e.detail.identifier);
    const { zoneId, formatId, field } = pathToData;
    const zone = zones!.find(zone => zone.id === zoneId);
    if (zone) {
      let price: any = zone.price ? { ...zone.price } : {};
      if (formatId) {
        const format = zone.formats.find(format => format.id === formatId);
        price = format && format.price ? { ...format.price } : {};
      }
      const value = e.detail.value;
      price[field] = value !== '' ? Number(e.detail.value) : null;
      handleOnDataChange(pathToData, price);
    }
  };

  useEvent({
    eventType: 'demeter-input-change',
    onHandler: handleDemeterInputChange,
    refEl,
    rebind: [zones],
  });

  if (zones && zones.length > 0) {
    return (
      <div ref={refEl}>
        <DataTable
          gridOptions={{
            columnDefs: [
              {
                field: 'name',
                headerName: 'Zones',
              },
              {
                field: 'unitary_price_guarantee',
                headerName: 'Unitary Price - Guarantee (€)',
              },
              {
                field: 'zone_format_price_guarantee',
                headerName: 'Zone + Format - Guarantee (€)',
              },
              {
                field: 'unitary_price_no_guarantee',
                headerName: 'Unitary Price - No Guarantee (€)',
              },
              {
                field: 'zone_format_price_no_guarantee',
                headerName: 'Zone + Format - No Guarantee (€)',
              },
            ],
            onGridReady: () => {},
            rawData,
          }}
        />
      </div>
    );
  } else {
    return (
      <p ref={refEl}>
        <em>No format available for this zone.</em>
      </p>
    );
  }
};

export default ZonesAndFormatsPricesTable;
