import * as _ from 'lodash';
import * as React from 'react';
import {
  formats as formatsDuckling,
} from '../ducklings';
import { useContainerLabelStepper } from '../../shared/use';
import { LineItemContext, LineItemSectionProps } from '../CommonDemandWorkflowLineItem';

import { getTemplatesState, TemplateCheckboxState } from './utils';
import {
  DemeterCheckboxItem,
  DemeterCheckboxItemPropItem,
} from '../../shared/demeterWrappers';

import './LineItemFormats.css';
import { isFormAlreadyInitialized } from '../utils';

interface LineItemFormatsProps extends LineItemSectionProps {

}

function LineItemFormats(props: LineItemFormatsProps) {
  const lineItemState = React.useContext(LineItemContext);
  const formats = formatsDuckling.useFormats();

  React.useEffect(() => {
    if (isFormAlreadyInitialized(props, lineItemState) && formats && formats.data && formats.data.length) {
      props.updateFieldState({
        templates: getTemplatesState({
          currentState: lineItemState.fieldsState.templates,
          zonesSectionState: lineItemState.fieldsState.zoneTypes,
          formatList: formats.data,
        }),
      });
    }
  }, [lineItemState.fieldsState.zoneTypes, formats]);

  const ContainerStepper = useContainerLabelStepper('Formats', 5);

  function onCheckboxItemClick(
    item: DemeterCheckboxItemPropItem<TemplateCheckboxState>
  ) {
    let newTemplates = [
      ...lineItemState.fieldsState.templates.map(ztt => ({
        ...ztt,
      })),
    ];
    _.set(newTemplates, `[${item.pos}].checked`, !item.datum.checked);
    props.updateFieldState({
      templates: newTemplates,
    });
  }

  function isCheckboxItemDisabled(
    item: DemeterCheckboxItemPropItem<TemplateCheckboxState>
  ) {
    const selectedZoneTypes = lineItemState.fieldsState.zoneTypes
      .filter(zt => zt.checked)
      .map(zt => zt.id);
    return !item.datum.formats.some(formatWithZoneType =>
      selectedZoneTypes.includes(formatWithZoneType.zone_type)
    );
  }

  function renderZoneTypeCheckboxes() {
    return (
      <div className="checkboxList">
        {_.map(
          lineItemState.fieldsState.templates,
          (templateCheckboxState, idx) => {
            return (
              <DemeterCheckboxItem<TemplateCheckboxState>
                key={`template-${templateCheckboxState.id}`}
                className="templateCheckboxItem"
                item={{
                  id: templateCheckboxState.id,
                  label: templateCheckboxState.name,
                  datum: templateCheckboxState,
                  pos: idx,
                }}
                onClick={onCheckboxItemClick}
                checked={templateCheckboxState.checked}
                disabled={isCheckboxItemDisabled}
              />
            );
          }
        )}
      </div>
    );
  }

  function renderNoTemplatesMessage() {
    return (
      <div
        style={{
          fontSize: '18px',
        }}
      >
        Please select first at least:
        <ul>
          <li>One Retailer</li>
          <li>One Zone</li>
        </ul>
      </div>
    );
  }

  function renderBody() {
    if (lineItemState.fieldsState.templates.length) {
      return renderZoneTypeCheckboxes();
    }
    return renderNoTemplatesMessage();
  }

  return (
    <demeter-container class="lineItemFormats-root" label="Formats">
      {renderBody()}
      <ContainerStepper />
      <p className="description" slot="description">
        Select, for each zone, the formats for this line item.
      </p>
    </demeter-container>
  );
}

export default LineItemFormats;
