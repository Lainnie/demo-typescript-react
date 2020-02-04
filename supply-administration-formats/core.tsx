import { RiseSVC } from 'olympus-anesidora';

// Typings

export interface ZoneFormatWithFormat extends RiseSVC.ZoneFormat {
  format: RiseSVC.Format;
}

export interface ZoneWithFormats extends RiseSVC.Zone {
  formats: ZoneFormatWithFormat[];
}

// Pure Functions

export const isValidRetailer = (retailer: any) =>
  retailer && retailer.id && retailer.id !== '#select-a-retailer';

export const sortZonesEnabledFirst = (zones: RiseSVC.Zone[]) =>
  zones.sort((a, b) => (a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1)); // enabled zones first

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
