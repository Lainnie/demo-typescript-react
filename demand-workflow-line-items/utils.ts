import { RiseSVC, MeccaSVC, CrownSVC, WiseSVC } from 'olympus-anesidora';
import { DropdownItemBaseProps } from '../shared/Dropdown';
import { ZoneCheckboxState, getZoneTypesState } from './line-item-zones/utils';
import { ApiCampaign, LineItemBundle } from '../demand-campaigns/core';
import { UserState_user } from '../authent/core';
import {
  getTemplatesState,
} from './line-item-formats/utils';
import { LineItemForm_fieldsState, LineItemSectionProps, LineItemForm } from './CommonDemandWorkflowLineItem';

export interface RawZoneType {
  id: MeccaSVC.Zone;
  name: string;
}

export const zoneTypeToTextMappings: { [key in MeccaSVC.Zone]: string } = {
  [MeccaSVC.Zone.HOME]: 'Home page',
  [MeccaSVC.Zone.SEARCH]: 'Search pages',
  [MeccaSVC.Zone.SHELF]: 'Shelves',
  [MeccaSVC.Zone.CHECKOUT]: 'Checkout',
  [MeccaSVC.Zone.PRODUCT_PAGE]: 'Product pages',
};

export const rawZoneTypes: RawZoneType[] = [
  {
    id: MeccaSVC.Zone.HOME,
    name: 'Home page',
  },
  {
    id: MeccaSVC.Zone.SEARCH,
    name: 'Search pages',
  },
  {
    id: MeccaSVC.Zone.SHELF,
    name: 'Shelves',
  },
  {
    id: MeccaSVC.Zone.CHECKOUT,
    name: 'Checkout',
  },
  {
    id: MeccaSVC.Zone.PRODUCT_PAGE,
    name: 'Product pages',
  },
];

export interface RetailerCartridgeState {
  retailer: RiseSVC.Retailer;
  liRetailer: CrownSVC.LineItemRetailer | null;
  budget: string;
}

// interface LineItemBundleOrigin {
//   lineItem: CrownSVC.LineItem;
//   lineItemRetailers: CrownSVC.LineItemRetailer[];
//   creatives: CrownSVC.Creative[];
// }

interface GetLineItemBundleJsonInput {
  currentUser: UserState_user;
  campaign: ApiCampaign;
  origin?: LineItemBundle;
  formData: LineItemForm_fieldsState;
  guaranteed: boolean;
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── PREPARE LINE ITEM ──────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

type PrepareLineItemInput = GetLineItemBundleJsonInput;
function prepareLineItem({
  currentUser,
  campaign,
  origin,
  formData,
  guaranteed = true,
}: PrepareLineItemInput): CrownSVC.LineItem {
  const isAnUpdate = origin !== undefined;

  const item_type = isAnUpdate
    ? origin!.lineItem.item_type
    : guaranteed
    ? CrownSVC.LineItem_itemType.GUARANTEED
    : CrownSVC.LineItem_itemType.NON_GUARANTEED;

  const status = isAnUpdate
    ? origin!.lineItem.status
    : CrownSVC.LineItem_status.WIP;

  let json: CrownSVC.LineItem = {
    item_type,
    name: formData.name,
    budget: parseInt(formData.budget),
    start_date: formData.start_date.toISOString(),
    end_date: formData.end_date.toISOString(),
    products: formData.mProducts.map(mprod => mprod.id),
    endson: CrownSVC.LineItem_endson.END_DATE,
    delivery_curve: CrownSVC.LineItem_deliveryCurve.NORMAL,
    account_id: currentUser.account_id,
    status,
    zones: formData.zoneTypes
      .filter(zoneType => zoneType.checked)
      .reduce((res: string[], zoneType) => {
        let tmpRes = [...res];

        for (const zoneId of zoneType.zones) {
          if (!tmpRes.includes(zoneId)) {
            tmpRes = [...tmpRes, zoneId];
          }
        }

        return tmpRes;
      }, []),
  };

  if (isAnUpdate) {
    json = {
      id: origin!.lineItem.id,
      ...json,
    };
  }

  return json;
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── PREPARE LINEITEM RETAILERS ─────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

interface PrepareLineItemRetailersOutput {
  /** C for Create & U for Update: LineItemRetailers to create or update */
  CU: CrownSVC.LineItemRetailer[];
  /** D for Delete: Ids from LineItemRetailers to delete */
  D: string[];
}

type PrepareLineItemRetailersInput = GetLineItemBundleJsonInput;
function prepareLineItemRetailers({
  origin,
  currentUser,
  campaign,
  formData,
  guaranteed = true,
}: PrepareLineItemRetailersInput): PrepareLineItemRetailersOutput {
  let res: PrepareLineItemRetailersOutput = {
    CU: [],
    D: [],
  };

  for (const retailerCartridgeState of formData.retailers) {
    const currentRetailerBudget = Number(retailerCartridgeState.datum.budget);

    // No liRetailer => Create new LineItemRetailer
    if (!retailerCartridgeState.datum.liRetailer) {
      const newLineItemRetailer: CrownSVC.LineItemRetailer = {
        budget: currentRetailerBudget,
        retailer_id: retailerCartridgeState.datum.retailer.id!,
        blacklisted: false,
      };

      res = {
        ...res,
        CU: [...res.CU, newLineItemRetailer],
      };
      // Existing liRetailer => Update current LineItemRetailer
    } else {
      const updatedLineItemRetailer: CrownSVC.LineItemRetailer = {
        ...retailerCartridgeState.datum.liRetailer,
        budget: currentRetailerBudget,
      };
    }
  }

  // Check if LineItemRetailers to delete
  if (origin && origin.lineItemRetailers) {
    const originLineItemRetailersIds = origin!.lineItemRetailers.map(
      lir => lir.retailer_id
    );
    const remainingLineItemRetailersIds = formData.retailers
      // Only get the retailers associated to an existing LineItemRetailer
      .filter(retailerCartridgeState => retailerCartridgeState.datum.liRetailer)
      .map(
        retailerCartridgeState =>
          retailerCartridgeState.datum.liRetailer!.retailer_id
      );

    for (const originLineItemRetailerId of originLineItemRetailersIds) {
      if (!remainingLineItemRetailersIds.includes(originLineItemRetailerId)) {
        res = {
          ...res,
          D: [...res.D, originLineItemRetailerId],
        };
      }
    }
  }

  return res;
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── PREPARE CREATIVES ──────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

interface PrepareCreativesOutput {
  /** C for Create & U for Update: Creatives to create or update */
  CU: CrownSVC.Creative[];
  /** D for Delete: Ids from Creatives to delete */
  D: string[];
}

type PrepareCreativesInput = GetLineItemBundleJsonInput;
function prepareCreatives({
  origin,
  currentUser,
  campaign,
  formData,
  guaranteed = true,
}: PrepareCreativesInput): PrepareCreativesOutput {
  let res: PrepareCreativesOutput = {
    CU: [],
    D: [],
  };

  const checkedTemplates = formData.templates.filter(
    templateCheckboxState => templateCheckboxState.checked
  );

  for (const templateCheckboxState of checkedTemplates) {
    // No Creative => Create a new Creative
    if (!templateCheckboxState.creative) {
      const newCreative: CrownSVC.Creative = {
        account_id: currentUser.account_id,
        template_id: templateCheckboxState.id,
        template_settings: '',
      };

      res = {
        ...res,
        CU: [...res.CU, newCreative],
      };
      // Existing Creative => Update current Creative
    } else {
      // !! IS THERE SOMETHING TO UPDATE ?
    }
  }

  // Check if there are Creatives to Delete (Archive)
  if (origin && origin.creatives) {
    const originCreativesIds = origin.creatives.map(crea => crea.id!);

    const remainingCreativesIds = formData.templates
      // Only get the Templates associated to an existing Creative
      .filter(templateCheckboxState => templateCheckboxState.creative)
      .map(templateCheckboxState => templateCheckboxState.creative!.id);

    for (const originCreativeId of originCreativesIds) {
      if (!remainingCreativesIds.includes(originCreativeId)) {
        res = {
          ...res,
          D: [...res.D, originCreativeId],
        };
      }
    }
  }

  return res;
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── GET LINE ITEM BUNDLE JSON ──────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

export function getLineItemBundleJson(input: GetLineItemBundleJsonInput) {
  const lineItem = prepareLineItem(input);
  const lineItemRetailers = prepareLineItemRetailers(input);
  const creatives = prepareCreatives(input);

  return {
    lineItem,
    lineItemRetailers,
    creatives,
  };
}

export type LineItemBundleJson = ReturnType<typeof getLineItemBundleJson>;

interface GetLineItemFormStateInput {
  origin: LineItemBundle;
  mProductList: MeccaSVC.MProduct[];
  zoneList: RiseSVC.Zone[];
  retailerList: RiseSVC.Retailer[];
  formatList: RiseSVC.Format[];
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── GET LINE ITEM FORM STATE ───────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the form' state based on a LineItem and a list of mProducts
 * @param json - LineItem object
 */
export function getLineItemFormState({
  origin,
  mProductList,
  zoneList,
  retailerList,
  formatList,
}: GetLineItemFormStateInput): LineItemForm_fieldsState {
  const mProducts: DropdownItemBaseProps<
    MeccaSVC.MProduct
  >[] = origin.lineItem.products.map(mProductId => {
    const currentMProduct = mProductList.find(mProd => mProd.id === mProductId);
    return {
      id: mProductId,
      label: currentMProduct!.name,
      datum: { ...currentMProduct! },
    };
  });

  // INIT RETAILERS
  const retailers = origin.lineItemRetailers.map(
    (
      liRet: CrownSVC.LineItemRetailer
    ): DropdownItemBaseProps<RetailerCartridgeState> => {
      const currentRetailer = retailerList.find(
        ret => ret.id === liRet.retailer_id
      );
      if (!currentRetailer) {
        throw new Error(`Cannot find retailer with id: ${liRet.retailer_id}`);
      }
      return {
        id: currentRetailer!.id!,
        label: currentRetailer.name,
        datum: {
          liRetailer: { ...liRet },
          retailer: { ...currentRetailer },
          budget: `${liRet.budget}`,
        },
      };
    }
  );

  // INIT ZONETYPES
  const selectedRetailers: RiseSVC.Retailer[] = origin.lineItem.zones!.map(
    zoneId => {
      const currentZone = zoneList.find(zone => zone.id === zoneId);
      if (!currentZone) {
        throw new Error(`Zone with id=${zoneId!} cannot be found!`);
      }
      const currentZoneRetailer = retailerList.find(
        retailer => retailer.id! === currentZone!.retailer_id
      );
      if (!currentZoneRetailer) {
        throw new Error(
          `Retailer from zone "${currentZone!.zone_type}/${
            currentZone!.id
          }" cannot be found!`
        );
      }
      return currentZoneRetailer;
    }
  );

  const zoneTypes = getZoneTypesState({
    origin,
    selectedRetailers,
    zoneList: zoneList,
  });

  // INIT TEMPLATES
  const templates = getTemplatesState({
    creatives: origin.creatives,
    zonesSectionState: zoneTypes,
    formatList,
  });

  return {
    name: origin.lineItem.name,
    budget: `${origin.lineItem.budget}`,
    start_date: new Date(origin.lineItem.start_date),
    end_date: new Date(origin.lineItem.end_date),
    retailers,
    mProducts,
    zoneTypes,
    templates,
  };
}


export function isFormAlreadyInitialized<T extends LineItemSectionProps>(
  props: T,
  lineItemState: LineItemForm
): boolean {
  return props.previousFormInitialized && lineItemState.formInitialized;
};