import * as _ from 'lodash';
import * as React from 'react';
import { useContainerLabelStepper, usePrevious } from '../../shared/use';
import { LineItemContext, LineItemSectionProps, LineItemFormField, LineItemForm } from '../CommonDemandWorkflowLineItem';
import { zones as zonesDuckling } from '../ducklings';
import { getZoneTypesState, ZoneCheckboxState } from './utils';

import './LineItemZones.css';
import {
  DemeterCheckboxItem,
  DemeterCheckboxItemPropItem,
} from '../../shared/demeterWrappers';
import { isFormAlreadyInitialized } from '../utils';

interface LineItemZonesProps extends LineItemSectionProps {

}


function LineItemZones(props: LineItemZonesProps) {
  const lineItemState = React.useContext(LineItemContext);
  const previousRetailerState = usePrevious(lineItemState.fieldsState.retailers);
  const getAllZones = zonesDuckling.useGetAllZones();
  const zones = zonesDuckling.useZones();

  // On retailerList change:
  // - fetch zones
  React.useEffect(() => {
    if (isFormAlreadyInitialized(props, lineItemState) && previousRetailerState.length !== lineItemState.fieldsState.retailers.length) {
      getAllZones({
        retailersIds: lineItemState.fieldsState.retailers.map(
          ret => ret.id
        ),
        enabled: true,
      });
    }
  }, [lineItemState.fieldsState.retailers]);

    // On zonesList change, reset zoneTypes state
    React.useEffect(() => {
      if (isFormAlreadyInitialized(props, lineItemState)) {
        props.updateFieldState({
          zoneTypes: getZoneTypesState({
            currentState: lineItemState.fieldsState[LineItemFormField.ZONETYPES],
            selectedRetailers: lineItemState.fieldsState.retailers.map(
              ret => ret.datum.retailer
            ),
            zoneList: zones.data,
          }),
        });
      }
    }, [zones.data]);


  const ContainerStepper = useContainerLabelStepper('Zones', 4);

  function onCheckboxItemClick(
    item: DemeterCheckboxItemPropItem<ZoneCheckboxState>
  ) {
    let newZoneTypes = [
      ...lineItemState.fieldsState.zoneTypes.map(zt => ({
        ...zt,
      })),
    ];
    _.set(newZoneTypes, `[${item.pos}].checked`, !item.datum.checked);
    props.updateFieldState({
      zoneTypes: newZoneTypes,
    });
  }

  function isCheckboxItemDisabled(
    item: DemeterCheckboxItemPropItem<ZoneCheckboxState>
  ) {
    return !item.datum.retailers.length;
  }

  function displayCheckboxes() {
    return _.map(
      lineItemState.fieldsState.zoneTypes,
      (zoneType: ZoneCheckboxState, idx) => (
        <DemeterCheckboxItem<ZoneCheckboxState>
          key={`zoneSectionCheckbox-${zoneType.id}`}
          item={{
            id: zoneType.id,
            label: zoneType.name,
            datum: zoneType,
            pos: idx,
          }}
          onClick={onCheckboxItemClick}
          checked={zoneType.checked}
          disabled={isCheckboxItemDisabled}
        />
      )
    );
  }

  return (
    <demeter-container class="line-item-zones" label="Zones">
      <div className="inputs">{displayCheckboxes()}</div>

      <ContainerStepper />
      <p className="description" slot="description">
        Select the zones where you want to deliver this line item.
      </p>
    </demeter-container>
  );
}

export default LineItemZones;
