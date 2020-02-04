import * as React from 'react';
import * as _ from 'lodash';
import {
  LineItemProvider2,
  LineItemRouteProps,
  LineItemContext,
  defaultLineItemFormState,
  useMProductsFetchOnCampaignRetrieval,
  useOnSavingRequest,
  lineItemFormActions,
  GetRenderPropsOutput,
  useLineItemFormValidation,
  registerRequiredStores,
  useAreLineItemBundleDepsReady,
  useAreRequiredStoresRegistered,
  useLineItemFormUpdateOnCampaignRetrieval,
} from './CommonDemandWorkflowLineItem';
import { useRequestResetOnUnmount, useLastCreatedLineItemBundle, useCreateLineItemBundle } from '../demand-campaigns/use';
import {
  useGetAllRetailers,
  useRetailers,
} from '../supply/core';
import {
  LineItemBundle, useCampaign, useGetAllCampaigns,
} from '../demand-campaigns/core';
import { useValidation, usePrevious } from '../shared/use';
import {  getLineItemBundleJson, getLineItemFormState } from './utils';
import { getDynamicPath } from '../shared/utils/paths';
import { LineItemPage } from './LineItemPage/LineItemPage';
import {
  lineItemBundle as lineItemBundleDuckling,
  zones as zonesDuckling,
  formats as formatsDuckling,
  templates as templatesDuckling,
  lineItemBundle,
} from './ducklings';
import { useMProducts } from './use';
import { LineItemBundleReducerState } from '../shared/ducks';


/**
 * Fetch the zones from the lineItem associated Retailers.
 * Used on:
 *  - initial lineItemBundle fetch
 *  - cancel button click
 *
 * @param getAllZones
 * @param lineItemBundleState
 */
const initialZonesFetching = (
  getAllZones: ReturnType<typeof zonesDuckling.useGetAllZones>,
  lineItemBundle: LineItemBundle,
) => {
  getAllZones({
    retailersIds: lineItemBundle.lineItemRetailers.map(liRet => liRet.retailer_id),
    enabled: true,
  });
};


// ────────────────────────────────────────────────────────────────────────────────
//
// ─── COMPONENT WRAPPER ──────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

type EditDemandWorkflowLineItemInnerProps = GetRenderPropsOutput;

function EditDemandWorkflowLineItemInner({
  currentUser,
  location,
  match,
  dispatch,
  history,
  update,
  requestSaving,
  requestSavingReset
}: EditDemandWorkflowLineItemInnerProps
) {
  const lineItemState = React.useContext(LineItemContext);
  const previousFormInitialized = usePrevious(lineItemState.formInitialized);
  const areRequiredStoresRegistered = useAreRequiredStoresRegistered('edit');

  const getLineItemBundle = lineItemBundleDuckling.useGetLineItemBundle();
  const updateLineItemBundle = lineItemBundleDuckling.useUpdateLineItemBundle();
  const getCampaign = useGetAllCampaigns(match.params.campaign_id);
  const getAllRetailers = useGetAllRetailers();
  const getAllZones = zonesDuckling.useGetAllZones();
  const getFormats = formatsDuckling.useGetAllFormats();
  const getTemplates = templatesDuckling.useGetAllTemplates();

  const campaign = useCampaign(match.params.campaign_id);


  // REGISTER ALL REQUIRED STORES
  React.useEffect(() => {
    registerRequiredStores('edit');
  }, []);

  useLineItemFormUpdateOnCampaignRetrieval(campaign, dispatch);
  useMProductsFetchOnCampaignRetrieval(campaign, areRequiredStoresRegistered);

  // ON ALL STORES REGISTRATION, FETCH DATA
  React.useEffect(() => {
    if (areRequiredStoresRegistered) {
      getCampaign();
      getAllRetailers();
      getFormats();
      getTemplates();
      getLineItemBundle(match.params.line_item_id!);
    }
  }, [areRequiredStoresRegistered])

  const {
    lineItemBundleState,
    retailers,
    mProductsState,
    zonesState,
    formatsState,
    areLineItemBundleDepsReady,
  } = useAreLineItemBundleDepsReady();


  // ZONE-TYPES STUFF
  React.useEffect(() => {
    if (lineItemBundleState.datum) {
      initialZonesFetching(getAllZones, lineItemBundleState.datum);
      // getAllZones({
      //   retailersIds: lineItemBundleState.datum.lineItemRetailers.map(liRet => liRet.retailer_id),
      //   enabled: true,
      // });
    }
  }, [lineItemBundleState.datum]);

  React.useEffect(() => {
    if (!lineItemState.formInitialized && areLineItemBundleDepsReady) {
      const formState = getLineItemFormState({
        origin: lineItemBundleState.datum!,
        mProductList: mProductsState.data,
        zoneList: zonesState.data,
        retailerList: retailers,
        formatList: formatsState.data,
      });
      update({
        fieldsState: formState,
        formInitialized: true,
      });
    }
  }, [lineItemState.formInitialized, areLineItemBundleDepsReady]);

  useLineItemFormValidation({
    dispatch,
    currentLineItemState: lineItemState,
  });

  useOnSavingRequest({
    lineItemState,
    dispatch,
    callback: () => {
      const json = getLineItemBundleJson({
        origin: lineItemBundleState.datum!,
        currentUser,
        campaign: lineItemState.campaign!,
        formData: lineItemState.fieldsState,
        guaranteed: location.searchParams.guaranteed,
      });
      updateLineItemBundle(json);
    }
  });

  const onCancelClick = React.useCallback((data: LineItemBundle) => {
    // Reset initial form state
    initialZonesFetching(getAllZones, data);
    update({
      formInitialized: false,
    });
  }, []);

  const onRequestSuccessFunc = React.useCallback((data: LineItemBundle | null) => {
    _.delay(
      lineItemRouteInfo => {
        history.push(
          getDynamicPath('demand.workflow.lineItem', lineItemRouteInfo, {
            guaranteed: location.searchParams.guaranteed,
          })
        );
      },
      2000,
      {
        campaign_id: data!.lineItem.campaign!.id,
        line_item_id: data!.lineItem.id,
      }
    );
  }, []);

  // const validationComponent = useValidation<any, LineItemBundle>({
  //   handlerAction: requestSaving,
  //   request: '',
  //   requestInProgress: false,
  //   requestReady: lineItemState.formValidated,
  //   texts: {
  //     fire: 'Update',
  //     succeeded: 'Updated',
  //     failed: 'Click to retry',
  //   },
  //   messages: {
  //     succeeded: 'Update successful',
  //     failed: 'The update failed',
  //   },
  //   onCancel: [onCancelClick, lineItemBundleState.datum!],
  //   onRequestSuccess: [onRequestSuccessFunc, lineItemBundleState.datum],
  // });




  return (
    <LineItemPage<any, LineItemBundle>
      previousFormInitialized={previousFormInitialized}
      currentUser={currentUser}
      location={location}
      match={match}
      initialLineItemState={defaultLineItemFormState}
      currentLineItemState={lineItemState}
      update={update}
      validationComponentProps={{
        handlerAction: requestSaving,
        request: '',
        requestInProgress: false,
        requestReady: lineItemState.formValidated,
        texts: {
          fire: 'Update',
          succeeded: 'Updated',
          failed: 'Click to retry',
        },
        messages: {
          succeeded: 'Update successful',
          failed: 'The update failed',
        },
        onCancel: [onCancelClick, lineItemBundleState.datum!],
        onRequestSuccess: [onRequestSuccessFunc, lineItemBundleState.datum],
      }}
      retailers={retailers}
    />
  );
}




interface EditDemandWorkflowLineItemProps
  extends LineItemRouteProps {}

function EditDemandWorkflowLineItem(
  props: EditDemandWorkflowLineItemProps
) {
  return (
    <LineItemProvider2
      {...props}
      render={(renderProps) => {
        return (
          <EditDemandWorkflowLineItemInner
            {...renderProps}
          />
        );
      }}
    />
  );
}

export default EditDemandWorkflowLineItem;
