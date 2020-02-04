import * as _ from 'lodash';
import * as React from 'react';
import { RiseSVC } from 'olympus-anesidora';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Validation from '../shared/Validation/Validation';
import { useRegisterForStore, useEvent } from '../shared/use';
import { useRetailerHeader } from '../supply/core';
import { useRetailers } from '../supply/use/useRetailers';
import {
  epics,
  reducers,
  useZones,
  useGetAllZones,
  useCreateZonesPrices,
} from '../supply-administration-zones/core';
import {
  epics as supplyEpics,
  reducers as supplyReducers,
  useUpdateRetailers,
} from '../supply/core';
import { ZoneWithFormats, isValidRetailer } from './core';
import { updatePriceInObject, getPricesVariance } from './pricesHelpers';
import ZonesAndFormatsPricesTable from './ZonesAndFormatsPricesTable';
import GeneralPrices from './GeneralPrices';

interface pathToData {
  zoneId: string;
  formatId?: string;
  field: string;
}

// Formats View
interface Props {
  retailer: string;
}

interface Variance {
  retailer: Partial<RiseSVC.Retailer>;
  prices: Partial<RiseSVC.ZonePrice>[] | Partial<RiseSVC.ZoneFormatPrice>[];
}

const SupplyAdministrationInventoryPrices = (props: Props) => {
  const refEl = React.useRef(null);
  const retailerList = useRetailers();
  const { currentRetailer, Header } = useRetailerHeader();
  const retailer = retailerList.find(
    (retailer: RiseSVC.Retailer) => retailer.id === currentRetailer.id
  );
  const updateRetailers = useUpdateRetailers();
  const createZonesPrices = useCreateZonesPrices();
  const getZones = useGetAllZones();
  const zonesList = useZones();
  const retailerZones = zonesList.filter(
    zone => zone.retailer_id === currentRetailer.id
  ) as ZoneWithFormats[];

  const [localRetailerZones, setLocalRetailerZones] = React.useState(
    [] as ZoneWithFormats[]
  );
  const [retailerZonesCopy, setRetailerZonesCopy] = React.useState(
    [] as ZoneWithFormats[]
  );
  const [retailerCopy, setRetailerCopy] = React.useState(
    {} as RiseSVC.Retailer
  );
  const [variance, setVariance] = React.useState({
    prices: [],
    retailer: {},
  } as Variance);

  const title =
    currentRetailer && currentRetailer.id
      ? `Inventory prices - ${currentRetailer.name}`
      : 'Inventory prices';

  useRegisterForStore({
    epics,
    identifier: 'supplyZones',
    reducers,
  });

  useRegisterForStore({
    epics: supplyEpics,
    identifier: 'supply',
    reducers: supplyReducers,
  });

  // update price in a specific zone or zoneFormat (copy object)
  const updatePrice = (pathToData: pathToData, priceUpdated: any) => {
    const { zoneId, formatId } = pathToData;
    if (priceUpdated) {
      setRetailerZonesCopy((retailerZonesCopy: ZoneWithFormats[]) => {
        const retailerZonesCopyUpdated = retailerZonesCopy.map(
          (zone: ZoneWithFormats) => {
            const zoneCopy = _.cloneDeep(zone);
            if (zoneCopy.id === zoneId) {
              if (formatId) {
                // Update Format Price
                zoneCopy.formats = zoneCopy.formats.map(format => {
                  if (formatId === format.id) {
                    if (!priceUpdated.zone_format_id) {
                      priceUpdated.zone_format_id = format.id;
                    }
                    return updatePriceInObject(format, priceUpdated);
                  }
                  return format;
                });
              } else {
                // Update Zone Price
                if (!priceUpdated.zone_id) {
                  priceUpdated.zone_id = zone.id;
                }
                return updatePriceInObject(zoneCopy, priceUpdated);
              }
            }
            return zoneCopy;
          }
        ) as ZoneWithFormats[];
        return retailerZonesCopyUpdated;
      });
    }
  };

  // Update retailer
  const updateRetailer = (retailerUpdated: RiseSVC.Retailer) => {
    setRetailerCopy({ ...retailerUpdated });
  };

  const handleDemeterButtonClick = (event: CustomEvent) => {
    switch (event.detail.identifier) {
      case 'save':
        if (variance.prices.length > 0) {
          createZonesPrices(variance.prices);
        }
        if (variance.retailer.id) {
          updateRetailers([variance.retailer]);
        }
        break;
      case 'annulation':
        setRetailerZonesCopy([...retailerZones]);
        setRetailerCopy(currentRetailer);
        break;
      default:
        break;
    }
    event.stopPropagation();
  };

  useEvent({
    eventType: 'demeter-button-click',
    onHandler: handleDemeterButtonClick,
    refEl,
    rebind: [variance, retailerZones],
  });

  // set local retailer copy
  React.useEffect(() => {
    if (retailer) {
      setRetailerCopy(retailer);
    }
  }, [retailerList, currentRetailer]);

  // set local zones copy
  React.useEffect(() => {
    setLocalRetailerZones(retailerZones);
    setRetailerZonesCopy(retailerZones);
  }, [zonesList, currentRetailer]);

  // fetch zones (from store)
  React.useEffect(() => {
    getZones();
  }, []);

  // retailer min_budget variance
  React.useEffect(() => {
    if (retailer) {
      if (retailerCopy.min_budget !== retailer.min_budget) {
        setVariance(variance => ({
          ...variance,
          retailer: {
            id: retailerCopy.id,
            min_budget: retailerCopy.min_budget,
          },
        }));
      } else {
        setVariance(variance => ({
          ...variance,
          retailer: {},
        }));
      }
    }
  }, [retailerCopy]);

  // prices variance
  React.useEffect(() => {
    const zonesVariance = _.differenceWith(
      retailerZonesCopy,
      localRetailerZones,
      _.isEqual
    );
    setVariance(variance => ({
      ...variance,
      prices: [...getPricesVariance(zonesVariance, localRetailerZones)],
    }));
  }, [localRetailerZones, retailerZonesCopy]);

  // show / hide validation bar
  React.useEffect(() => {
    document.dispatchEvent(
      new CustomEvent(
        variance.prices.length > 0 || _.get(variance, 'retailer.min_budget')
          ? 'activate-validation'
          : 'deactivate-validation',
        {}
      )
    );
  }, [variance]);

  const headerChildren = (headerProps: Props) => <Header />;

  const contentChildren = (childrenProps: Props) =>
    isValidRetailer(currentRetailer) ? (
      <>
        <Title>{title}</Title>
        <GeneralPrices
          retailer={retailerCopy}
          handleOnDataChange={updateRetailer}
        />
        <demeter-container
          class={'column-1-7'}
          label={'Prices per zones & formats per zone'}
        >
          <p>
            {`Inventory prices for each zones and each format per zone. The price
            for a format on a specific zone is the addition between unitary
            price of zone and unitary price of format in this zone. It's summed
            in the total column for each type of diffusion (garanteed and non
            guaranteed).`}
          </p>
          <div>
            <ZonesAndFormatsPricesTable
              zones={retailerZonesCopy}
              handleOnDataChange={updatePrice}
            />
          </div>
        </demeter-container>
      </>
    ) : (
      <h1 style={{ gridColumn: '1 / 7' }}>↑ Select a retailer</h1>
    );

  const validationChildren = (validationProps: Props) => <Validation />;

  return (
    <AthenaDocumentTitle pageName="Supply Formats">
      <div ref={refEl} className="full-height">
        <Content
          {...props}
          contentClass="supply-administration-formats"
          headerChildren={headerChildren}
          contentChildren={contentChildren}
          validationChildren={validationChildren}
        />
      </div>
    </AthenaDocumentTitle>
  );
};

export default SupplyAdministrationInventoryPrices;
