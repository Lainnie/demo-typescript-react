import * as _ from 'lodash';
import * as React from 'react';
import { RiseSVC, Anesidora } from 'olympus-anesidora';
import {
  Dropdown,
  DropdownItemBaseProps,
  DropdownAttrMode,
} from '../../shared/Dropdown';
import { useContainerLabelStepper } from '../../shared/use';

import './LineItemRetailers.css';
import { LineItemContext, LineItemSectionProps } from '../CommonDemandWorkflowLineItem';
import {
  DemeterCartridgeItem,
  DemeterCartridgeItemPropItem,
  DemeterInputText,
  DemeterInputTextPropItem,
} from '../../shared/demeterWrappers';
import { RetailerCartridgeState } from '../utils';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── MAIN - LINE ITEM RETAILER ──────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

interface LineItemRetailersProps extends LineItemSectionProps {
  retailerList: RiseSVC.Retailer[];
}

const defaultRetailerList: RiseSVC.Retailer[] = [
  {
    id: '1551976475946',
    name: 'Carrefour',
    country: Anesidora.Country.FR,
    min_budget: 0,
    categories: [],
    roots: '',
    language: 'fra',
    currency: 'EUR',
  },
  {
    id: '15519764759423',
    name: 'Auchan',
    country: Anesidora.Country.FR,
    min_budget: 0,
    categories: [],
    roots: '',
    language: 'fra',
    currency: 'EUR',
  },
];

interface RetailerCartridgeItemPlus {
  pos: number;
}

function LineItemRetailers({ retailerList = defaultRetailerList, updateFieldState }: LineItemRetailersProps) {
  const lineItemState = React.useContext(LineItemContext);

  const ContainerStepper = useContainerLabelStepper('Retailers', 2);

  function onDeleteRetailer(
    item: DemeterCartridgeItemPropItem<RetailerCartridgeState> &
      RetailerCartridgeItemPlus
  ) {
    updateFieldState({
      retailers: _.filter(
        lineItemState.fieldsState.retailers,
        selectedRetailer => {
          return (
            selectedRetailer && selectedRetailer.id !== item.datum.retailer.id
          );
        }
      ),
    });
  }

  function onRetailerSelected(
    newRetailer: DropdownItemBaseProps<RetailerCartridgeState>
  ) {
    updateFieldState({
      retailers: [
        ...lineItemState.fieldsState.retailers!,
        newRetailer,
      ],
    });
  }

  function getRetailerList() {
    return _.chain(retailerList)
      .filter(retailer => {
        return !_.find(
          lineItemState.fieldsState.retailers,
          selected => selected.id === retailer.id
        );
      })
      .map(
        (retailer): DropdownItemBaseProps<RetailerCartridgeState> => ({
          id: retailer.id || '',
          label: retailer.name,
          datum: {
            retailer,
            budget: '',
            liRetailer: null,
          },
        })
      )
      .value();
  }

  function onRetailerBudgetChange(
    item: DemeterInputTextPropItem<RetailerCartridgeState> &
      RetailerCartridgeItemPlus,
    budget: string
  ) {
    let newItemState =
      lineItemState.fieldsState.retailers[item.pos];

    newItemState = {
      ...newItemState,
      datum: {
        ...newItemState.datum,
        budget,
      },
    };

    updateFieldState({
      retailers: [
        ..._.slice(
          lineItemState.fieldsState.retailers,
          0,
          item.pos
        ),
        newItemState,
        ..._.slice(
          lineItemState.fieldsState.retailers,
          item.pos + 1
        ),
      ],
    });
  }

  function getRetailerBudget(
    item: DemeterInputTextPropItem<RetailerCartridgeState> &
      RetailerCartridgeItemPlus
  ) {
    return lineItemState.fieldsState.retailers[item.pos].datum
      .budget;
  }

  function displayRetailers() {
    return _.map(
      lineItemState.fieldsState.retailers,
      (retailer, idx) => (
        <DemeterCartridgeItem<
          RetailerCartridgeState,
          {},
          RetailerCartridgeItemPlus
        >
          key={retailer.id}
          onDeletion={onDeleteRetailer}
          item={{ ...retailer, pos: idx }}
          render={({ item }) => (
            <DemeterInputText<
              RetailerCartridgeState,
              {},
              RetailerCartridgeItemPlus
            >
              identifier={`retailer#${item.datum.retailer.id}#budget`}
              item={{ datum: item.datum, pos: item.pos }}
              getValue={getRetailerBudget}
              onChange={onRetailerBudgetChange}
            />
          )}
        />
      )
    );
  }

  return (
    <demeter-container class="line-item-retailers" label="Retailers">
      <div className="inputs">
        <Dropdown
          identifier="currentRetailer"
          mode={DropdownAttrMode.FORM}
          label="Retailers list"
          disabled={false}
          noValueMessage="Select a retailer"
          itemList={getRetailerList()}
          loading={!retailerList || retailerList.length < 1}
          loadingMessage="Loading retailers"
          helper={
            'Select retailer in the list and add it. Repeat to add another retailer.'
          }
          onChange={onRetailerSelected}
        />
      </div>

      <div className="retailers">{displayRetailers()}</div>

      <ContainerStepper />
      <p className="description" slot="description">
        Select the retailers where you want to deliver this line item.
      </p>
    </demeter-container>
  );
}

export default LineItemRetailers;
