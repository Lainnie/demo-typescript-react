import * as _ from 'lodash';

const paths = {
  auth: {
    login: '/login',
    logout: '/logout',
  },
  supply: {
    root: '/supply',
    cockpit: '/supply/cockpit',
    lineItem: '/supply/line-item',
    reports: '/supply/reports',
    billing: '/supply/billing',
    administration: {
      root: '/supply/administration',
      zones: '/supply/administration/zones',
      formats: '/supply/administration/formats',
      inventoryPrices: '/supply/administration/inventory-prices',
    },
  },
  demand: {
    root: '/demand',
    cockpit: '/demand/cockpit',
    campaigns: '/demand/campaigns',
    reports: '/demand/reports',
    funding: '/demand/funding',
    administration: '/demand/administration',
    workflow: {
      newCampaign: '/demand/workflow/campaigns/new',
      newLineItem: '/demand/workflow/:campaign_id/line-item/new',
      campaign: '/demand/workflow/campaigns/:id',
      lineItem: '/demand/workflow/:campaign_id/line-item/:line_item_id',
    },
  },
};

export function getPath(pattern: string) {
  const path = _.get(paths, pattern);

  if (path) {
    return path;
  } else {
    const message = `path ${path} does not exists`;

    throw new Error(message);
  }
}

interface DynamicData {
  [key: string]: string;
}

interface GetDynamicPathSearchParams {
  [paramKey: string]: string|boolean|number|null
}

export function getDynamicPath(pattern: string, data: DynamicData, queryParams: GetDynamicPathSearchParams|undefined = undefined) {
  const path = getPath(pattern);

  let realPath = _.chain(data)
    .keys()
    .reduce((dynamicPath: string, key: string) => {
      return _.replace(dynamicPath, `:${key}`, data[key]);
    }, path)
    .value();

  if (queryParams) {
    let urlSearchParamsString = '';

    try {
      // @ts-ignore: TS is wrong, any type of value can be passed according to the Specs
      const urlSearchParams = new URLSearchParams(queryParams);
      urlSearchParamsString += `?${urlSearchParams.toString()}`;
    } catch (error) {
      throw error;
    }

    if (urlSearchParamsString) {
      realPath += urlSearchParamsString;
    }
  }

  return realPath;
}
