import * as React from 'react';
import { match } from 'react-router';
import * as _ from 'lodash';
import { CustomLocation } from '../../shared/routing';
import { CustomRouteSP, CustomRouteMP, LineItemForm_fieldsState, LineItemSectionProps, LineItemForm, LineItemFormField } from '../../demand-workflow-line-items/CommonDemandWorkflowLineItem';
import { Stepper } from '../stepper';
import { CustomTitle } from '../CustomTitle/CustomTitle';
import { LineItemGeneral } from '../line-item-general';
import { LineItemRetailers } from '../line-item-retailers';
import { LineItemProducts } from '../line-item-products';
import { LineItemZones } from '../line-item-zones';
import { LineItemFormats } from '../line-item-formats';
import { LineItemTargets } from '../line-item-targets';
import AreaHeader from '../../shared/Areas/Header';
import AreaMenu from '../../shared/Areas/Menu';
import Content from '../../shared/Areas/Content';

import './LineItemPage.css';
import {
  Validation,
  ValidationProps,
} from '../../shared/use';

interface LineItemPageProps<ReqSucc, Cancel> {
  previousFormInitialized: boolean,
  currentUser: any,
  location: CustomLocation<CustomRouteSP, {}> ,
  match: match<CustomRouteMP>,
  initialLineItemState: LineItemForm,
  currentLineItemState: LineItemForm,
  update: (newState: Partial<LineItemForm>) => void,
  validationComponentProps: ValidationProps<ReqSucc, Cancel>,
  retailers: any[]
}
export class LineItemPage<ReqSucc, Cancel> extends React.PureComponent<LineItemPageProps<ReqSucc, Cancel>> {
  updateFieldState = (newState: Partial<LineItemForm_fieldsState>) => {
    let stateDiff: Partial<LineItemForm> = {
      fieldsState: {
        ...this.props.currentLineItemState.fieldsState,
        ...newState
      },
    };

    const newStateEntries = Object.entries(newState) as unknown as [LineItemFormField, any][];

    for (const [fieldName, fieldValue] of newStateEntries) {
      if (this.props.currentLineItemState.dirty[fieldName] === false &&
        !_.isEqual(
          this.props.initialLineItemState.fieldsState[fieldName],
          fieldValue
        )
      ) {
        if (!stateDiff.dirty) {
          stateDiff = {
            ...stateDiff,
            dirty: {
              ...this.props.currentLineItemState.dirty,
              [fieldName]: true,
            },
          };
        } else {
          stateDiff = {
            ...stateDiff,
            dirty: {
              ...stateDiff.dirty,
              [fieldName]: true,
            },
          };
        }
      }
    }

    this.props.update(stateDiff);
  }

  getLiSectionComponentProps(): LineItemSectionProps {
    return {
      updateFieldState: this.updateFieldState,
      previousFormInitialized: this.props.previousFormInitialized,
    };
  }

  renderContentChildren = () => {
    return (
      <>
        <CustomTitle />
        <Stepper />
        <LineItemGeneral {...this.getLiSectionComponentProps()} />
        <LineItemRetailers {...this.getLiSectionComponentProps()} retailerList={this.props.retailers} />
        <LineItemProducts {...this.getLiSectionComponentProps()} />
        <LineItemZones {...this.getLiSectionComponentProps()} />
        <LineItemFormats {...this.getLiSectionComponentProps()} />
        <LineItemTargets {...this.getLiSectionComponentProps()} />
      </>
    );
  }

  renderValidationChildren = () => {
    return (
      <Validation
        {...this.props.validationComponentProps}
      />
    );
  }

  renderHeaderChildren = () => {
    return (
      <AreaHeader>
        <AreaHeader.Right>
          <AreaMenu>
            <AreaMenu.Item path={this.props.location.pathname}>General</AreaMenu.Item>
            <AreaMenu.Item>Creative Builder</AreaMenu.Item>
          </AreaMenu>
        </AreaHeader.Right>
      </AreaHeader>
    );
  }

  render() {
    return (
      <div className="full-height">
        <Content
          contentClass="LineItemPage-content"
          contentChildren={this.renderContentChildren}
          headerChildren={this.renderHeaderChildren}
          validationChildren={this.renderValidationChildren}
        />
      </div>
    );
  }
}