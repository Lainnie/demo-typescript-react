import * as _ from 'lodash';
import { RiseSVC } from 'olympus-anesidora';

export const updatePriceInObject = (object: any, price: any) => {
  const objectCopy = _.cloneDeep(object);
  objectCopy.price = {
    ...objectCopy.price,
    ...price,
  } as RiseSVC.ZoneFormatPrice;
  return objectCopy;
};

const findPriceInZonesById = (zones: any, priceId: string) => {
  let price = undefined;
  zones.some((zone: any) => {
    if (_.get(zone, 'price.id') === priceId) {
      price = zone.price;
      return true;
    }
    if (zone.formats) {
      zone.formats.some((format: any) => {
        if (_.get(format, 'price.id') === priceId) {
          price = format.price;
          return true;
        }
        return false;
      });
    }
    return false;
  });
  return price;
};

const getPricesFromZones = (zones: RiseSVC.Zone[]) => {
  const prices: (RiseSVC.ZonePrice[] | RiseSVC.ZoneFormatPrice)[] = [];
  zones.forEach((zone: any) => {
    if (zone.price) {
      prices.push(zone.price);
    }
    if (zone.formats) {
      zone.formats.forEach((format: any) => {
        if (format.price) {
          prices.push(format.price);
        }
      });
    }
  });
  return prices;
};

const isPriceNull = (price: any) => {
  if (price === null) {
    return true;
  }
  if (price.guaranteed_price === null && price.non_guaranteed_price === null) {
    return true;
  }
  if (price.guaranteed_price === null && !('non_guaranteed_price' in price)) {
    return true;
  }
  if (!('guaranteed_price' in price) && price.non_guaranteed_price === null) {
    return true;
  }
  return false;
};

const isPriceUpdated = (priceUpdated: any, priceOriginal: any) => {
  if (isPriceNull(priceUpdated) && isPriceNull(priceOriginal)) {
    return false;
  }
  if (priceUpdated && priceOriginal) {
    if (
      (priceUpdated.guaranteed_price &&
        priceUpdated.guaranteed_price !== priceOriginal.guaranteed_price) ||
      (priceUpdated.non_guaranteed_price &&
        priceUpdated.non_guaranteed_price !==
          priceOriginal.non_guaranteed_price)
    ) {
      return true;
    }
  }
  if (priceUpdated && !priceOriginal) {
    return true;
  }
  if (priceUpdated === priceOriginal) {
    return true;
  }
  return false;
};

export const getPricesVariance = (updatedZones: any, originalZones: any) => {
  const prices: any = getPricesFromZones(updatedZones);
  return prices.filter((price: any) => {
    const originalPrice = findPriceInZonesById(originalZones, price.id);
    return isPriceUpdated(price, originalPrice);
  });
};
