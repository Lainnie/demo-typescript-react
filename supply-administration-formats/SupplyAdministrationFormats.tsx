import * as _ from 'lodash';
import * as React from 'react';
import { RiseSVC } from 'olympus-anesidora';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Validation from '../shared/Validation/Validation';
import { useRegisterForStore, useEvent } from '../shared/use';
import './SupplyAdministrationFormats.css';
import { useRetailerHeader } from '../supply/core';
import {
  epics,
  reducers,
  useZones,
  useGetAllZones,
  useUpdateZones,
} from '../supply-administration-zones/core';
import {
  ZoneWithFormats,
  ZoneFormatWithFormat,
  isValidRetailer,
  sortZonesEnabledFirst,
  capitalize,
} from './core';
import FormatsTable from './FormatsTable';
import FormatsExclusions from './FormatsExclusions';

// Formats View
interface Props {
  retailer: string;
}

const SupplyAdministrationFormats = (props: Props) => {
  const refEl = React.useRef(null);
  const { currentRetailer, Header } = useRetailerHeader();
  const updateZones = useUpdateZones();
  const getZones = useGetAllZones();
  const zonesList = useZones();
  const retailerZones = zonesList.filter(zone => zone.retailer_id === currentRetailer.id) as ZoneWithFormats[];

  const [localRetailerZones, setLocalRetailerZones] = React.useState([] as ZoneWithFormats[]);
  const [retailerZonesCopy, setRetailerZonesCopy] = React.useState([] as ZoneWithFormats[]);
  const [variance, setVariance] = React.useState([] as ZoneWithFormats[]);

  const title =
    currentRetailer && currentRetailer.id
      ? `Formats - ${currentRetailer.name}`
      : 'Formats';
  const getZoneClassName = (zone: RiseSVC.Zone) =>
    zone.enabled
      ? 'container-general container--enabled'
      : 'container-general container--disabled';

  useRegisterForStore({
    epics,
    identifier: 'supplyZones',
    reducers,
  });

  // update a format object on a specific zone (copy object)
  const updateZoneFormat = (zoneId: string, formatUpdated: ZoneFormatWithFormat) => {
    if (zoneId && formatUpdated) {
      setRetailerZonesCopy((retailerZonesCopy: ZoneWithFormats[]) => {
        const retailerZonesCopyUpdated = retailerZonesCopy.map((zone: ZoneWithFormats) => {
          if (zone.id === zoneId) {
            const newFormats = zone.formats.map((format: ZoneFormatWithFormat) => 
              format.id === formatUpdated.id ? {...formatUpdated} : {...format}
            );
            return {...zone, formats: newFormats};
          }
          return zone;
        }) as ZoneWithFormats[];
        return retailerZonesCopyUpdated;
      });
    }
  };

  const handleDemeterButtonClick = (event: CustomEvent) => {
    switch(event.detail.identifier){
      case 'save':
        updateZones(variance);
        break;
      case 'annulation':
        setRetailerZonesCopy([...retailerZones]);
        break;
      default:
        break;
    }
    event.stopPropagation();
  }

  useEvent({
    eventType: 'demeter-button-click',
    onHandler: handleDemeterButtonClick,
    refEl,
    rebind: [variance, retailerZones],
  });

  // set a local copy of current retailer zones
  React.useEffect(() => {
    setLocalRetailerZones(retailerZones);
    setRetailerZonesCopy(retailerZones);
  }, [zonesList, currentRetailer]);

  // fetch zones (from redux or gateway)
  React.useEffect(() => {
    getZones();
  }, []);

  // calculate variance
  React.useEffect(() =>  {
    setVariance(_.differenceWith(retailerZonesCopy, localRetailerZones, _.isEqual));
  }, [localRetailerZones, retailerZonesCopy]);

  // show / hide validation bar
  React.useEffect(() =>  {
    document.dispatchEvent(new CustomEvent(variance.length > 0 ? 'activate-validation' : 'deactivate-validation', {}));
  }, [variance]);

  const headerChildren = (headerProps: Props) => <Header />;

  const contentChildren = (childrenProps: Props) =>
    isValidRetailer(currentRetailer) ? (
      <>
        <Title>{title}</Title>
        <p>Define the formats on each zone.</p>
        {retailerZonesCopy.length > 0 ? (
          sortZonesEnabledFirst(retailerZonesCopy).map(
            (zone: ZoneWithFormats) => (
              <demeter-container
                class={getZoneClassName(zone)}
                label={capitalize(zone.zone_type)}
                key={zone.id}
              >
                <FormatsTable
                  formats={zone.formats}
                  handleOnDataChange={(format: ZoneFormatWithFormat) => updateZoneFormat(zone.id!, format)}
                />
                <FormatsExclusions
                  formats={zone.formats}
                  handleOnDataChange={(format: ZoneFormatWithFormat) => {
                    updateZoneFormat(zone.id!, format);
                  }}
                />
              </demeter-container>
            )
          )
        ) : (
          <p>This retailer has no zone.</p>
        )}
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

export default SupplyAdministrationFormats;
