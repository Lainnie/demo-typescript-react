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
  useAreRequiredStoresRegistered,
  useLineItemFormUpdateOnCampaignRetrieval,
  useResetRequiredStores,
} from './CommonDemandWorkflowLineItem';
import {
  useRequestResetOnUnmount,
  useLastCreatedLineItemBundle,
  useCreateLineItemBundle,
} from '../demand-campaigns/use';
import {
  useGetAllRetailers,
  useRetailers,
} from '../supply/core';
import {
  LineItemBundle, useCampaign, useGetAllCampaigns,
} from '../demand-campaigns/core';
import { useValidation, usePrevious } from '../shared/use';
import { getLineItemBundleJson } from './utils';
import { getDynamicPath } from '../shared/utils/paths';
import { LineItemPage } from './LineItemPage/LineItemPage';
import {
  formats as formatsDuckling,
  templates as templatesDuckling,
  zones as zonesDuckling,
} from './ducklings';
import { any } from 'joi';


// ────────────────────────────────────────────────────────────────────────────────
//
// ─── COMPONENT WRAPPER ──────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

type NewDemandWorkflowLineItemInnerProps = GetRenderPropsOutput;

function NewDemandWorkflowLineItemInner({
  currentUser,
  location,
  match,
  dispatch,
  history,
  update,
  requestSaving,
  requestSavingReset
}: NewDemandWorkflowLineItemInnerProps
) {
  const lineItemState = React.useContext(LineItemContext);
  const previousFormInitialized = usePrevious(lineItemState.formInitialized)
  const areRequiredStoresRegistered = useAreRequiredStoresRegistered('new');
  const resetRequiredStores = useResetRequiredStores();
  const {
    lastCreatedLineItem: lastCreatedLineItemBundle,
    request,
    requestInProgress,
  } = useLastCreatedLineItemBundle();
  const createLineItemBundle = useCreateLineItemBundle();

  const getCampaign = useGetAllCampaigns(match.params.campaign_id);
  const getAllZones = zonesDuckling.useGetAllZones();
  const getFormats = formatsDuckling.useGetAllFormats();
  const getTemplates = templatesDuckling.useGetAllTemplates();
  const getAllRetailers = useGetAllRetailers();

  const retailers = useRetailers();
  const campaign = useCampaign(match.params.campaign_id);

  React.useEffect(() => {
    registerRequiredStores('new');
  }, []);

  React.useEffect(() => {
    if (areRequiredStoresRegistered) {
      getCampaign();
      getAllRetailers();
      getFormats();
      getTemplates();
      dispatch(lineItemFormActions.liUpdate({ formInitialized: true }));
    }
  }, [areRequiredStoresRegistered]);

  useRequestResetOnUnmount();
  useLineItemFormUpdateOnCampaignRetrieval(campaign, dispatch);
  useMProductsFetchOnCampaignRetrieval(campaign, areRequiredStoresRegistered);

  useLineItemFormValidation({
    dispatch,
    currentLineItemState: lineItemState,
  });

  useOnSavingRequest({
    lineItemState,
    dispatch,
    callback: () => {
      const json = getLineItemBundleJson({
        currentUser,
        campaign: lineItemState.campaign!,
        formData: lineItemState.fieldsState,
        guaranteed: location.searchParams.guaranteed,
      });
      createLineItemBundle(match.params.campaign_id, json);
    }
  });

  const onCancelClick = React.useCallback(() => {
    resetRequiredStores();
    history.push(getDynamicPath('demand.workflow.campaign', {
      id: match.params.campaign_id,
    }));
  }, [history]);

  const onRequestSuccessFunc = React.useCallback((data: LineItemBundle | null) => {
    _.delay(
      lineItemRouteInfo => {
        resetRequiredStores();
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

  return (
    <LineItemPage<any,null>
      previousFormInitialized={previousFormInitialized}
      currentUser={currentUser}
      location={location}
      match={match}
      initialLineItemState={defaultLineItemFormState}
      currentLineItemState={lineItemState}
      update={update}
      validationComponentProps={{
        handlerAction: requestSaving,
        request,
        requestInProgress,
        requestReady: lineItemState.formValidated,
        texts: {
          fire: 'Save',
          succeeded: 'Saved',
          failed: 'Click to retry',
        },
        messages: {
          succeeded: 'You will be redirected to your LineItem shortly',
          failed: 'The creation failed',
        },
        onCancel: [onCancelClick, null],
        onRequestSuccess: [onRequestSuccessFunc, lastCreatedLineItemBundle],
      }}
      retailers={retailers}
    />
  );
}




interface NewDemandWorkflowLineItemProps
  extends LineItemRouteProps {}

function NewDemandWorkflowLineItem(
  props: NewDemandWorkflowLineItemProps
) {
  return (
    <LineItemProvider2
      {...props}
      render={(renderProps) => {
        return (
          <NewDemandWorkflowLineItemInner
            {...renderProps}
          />
        );
      }}
    />
  );
}

export default NewDemandWorkflowLineItem;
