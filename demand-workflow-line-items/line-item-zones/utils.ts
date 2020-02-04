import { RiseSVC, MeccaSVC } from "olympus-anesidora";
import { RawZoneType } from '../utils';
import { LineItemBundle } from "demand-campaigns/core";

export interface ZoneCheckboxState extends RawZoneType {
  /** List of Retailers ids */
  retailers: string[],
  /** List of Zones ids */
  zones: string[],
  /** List of Zones Formats ids */
  formats: string[],
  checked: boolean,
};

const defaultState: ZoneCheckboxState[] = [
  {
    id: MeccaSVC.Zone.HOME,
    name: 'Home page',
    retailers: [],
    zones: [],
    formats: [],
    checked: false,
  },
  {
    id: MeccaSVC.Zone.SEARCH,
    name: 'Search pages',
    retailers: [],
    zones: [],
    formats: [],
    checked: false,
  },
  {
    id: MeccaSVC.Zone.SHELF,
    name: 'Shelves',
    retailers: [],
    zones: [],
    formats: [],
    checked: false,
  },
  {
    id: MeccaSVC.Zone.CHECKOUT,
    name: 'Checkout',
    retailers: [],
    zones: [],
    formats: [],
    checked: false,
  },
  {
    id: MeccaSVC.Zone.PRODUCT_PAGE,
    name: 'Product pages',
    retailers: [],
    zones: [],
    formats: [],
    checked: false,
  },
];

interface GetZoneTypesStateInput {
  currentState?: ZoneCheckboxState[],
  origin?: LineItemBundle,
  selectedRetailers?: RiseSVC.Retailer[],
  zoneList?: RiseSVC.Zone[],
};

const getZoneTypesStateDefaultArg: GetZoneTypesStateInput = {
  currentState: [...defaultState],
  selectedRetailers: [],
  zoneList: [],
};

export const getZoneTypesState = ({
  currentState = [...defaultState],
  origin = undefined,
  selectedRetailers = [],
  zoneList = []
}: GetZoneTypesStateInput = getZoneTypesStateDefaultArg) => {
  if (selectedRetailers && selectedRetailers.length) {
    let tmpUpdatedState = [...currentState];

    for (const zone of zoneList) {
      const zoneTypeIdx = tmpUpdatedState.findIndex(zoneType => zoneType.id === zone.zone_type);

      let tmpUpdatedZoneType = {...tmpUpdatedState[zoneTypeIdx]};
      // Add zone's id
      if (!tmpUpdatedZoneType.zones.includes(zone.id!)) {
        tmpUpdatedZoneType.zones = [...tmpUpdatedZoneType.zones, zone.id!];
      }

      // Add zone's formats ids
      for (const zoneFormat of zone.formats!) {
        if (!tmpUpdatedZoneType.formats.includes(zoneFormat.format_id)) {
          tmpUpdatedZoneType.formats = [...tmpUpdatedZoneType.formats, zoneFormat.format_id];
        }
      }

      if (!tmpUpdatedZoneType.retailers.includes(zone.retailer_id)) {
        tmpUpdatedZoneType.retailers = [...tmpUpdatedZoneType.retailers, zone.retailer_id];
      }

      tmpUpdatedState = [
        ...tmpUpdatedState.slice(0, zoneTypeIdx),
        tmpUpdatedZoneType,
        ...tmpUpdatedState.slice(zoneTypeIdx + 1),
      ];
    }

    // Use origin to check the proper ZoneTypes
     if (origin) {
       const lineItemZoneTypes = origin.lineItem.zones!
        .map(zoneId => zoneList.find(zone => zone.id === zoneId)!)
        .map(zone => zone.zone_type);

      tmpUpdatedState = tmpUpdatedState.map((zoneCheckboxState) => ({
        ...zoneCheckboxState,
        checked: lineItemZoneTypes.includes(zoneCheckboxState.id),
      }));
     }

    return tmpUpdatedState;
  }
  return [...defaultState];
};