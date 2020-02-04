import * as React from 'react';
import { Link } from 'react-router-dom';
import { LineItemContext } from '../CommonDemandWorkflowLineItem';
import { Title } from '../../shared/Typography';
import { getDynamicPath } from '../../shared/utils/paths';

export function CustomTitle() {
  const lineItemForm = React.useContext(LineItemContext);
  const lineItemName =
    lineItemForm.fieldsState && lineItemForm.fieldsState.name
      ? lineItemForm.fieldsState.name
      : 'Line item';
  const campaign = lineItemForm.campaign;
  return (
    <div className="custom-title">
      <Title>{lineItemName}</Title>
      {campaign && (
        <Link
          to={getDynamicPath('demand.workflow.campaign', { id: campaign!.id })}
        >
          {campaign!.name}
        </Link>
      )}
    </div>
  );
}