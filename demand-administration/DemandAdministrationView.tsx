import * as _ from 'lodash';
import * as React from 'react';
import { BrandsSVC } from 'olympus-anesidora';
import Content from '../shared/Areas/Content';
import AreaHeader from '../shared/Areas/Header';
import Title from '../shared/Areas/Title';
import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../shared/Dropdown';
import { Body } from '../shared/Typography';
import {
  brandProductsGroupedByShelvesReducerActions, BrandProductsGroupedByShelvesReducerState,
} from './core';
import { ShelvesProductsTree } from './ShelvesProductsTree';

export interface DemandAdministrationViewProps {
  brands: BrandsSVC.Brand[];
  brand: BrandsSVC.Brand | null;
  setBrand: (brandItem: BrandsSVC.Brand) => void;
  brandProductsGroupedByShelves: BrandProductsGroupedByShelvesReducerState;
  getBrandProductsByShelves: typeof brandProductsGroupedByShelvesReducerActions.getBrandProductsGroupedByShelves;
}


class DemandAdministrationView extends React.Component<
  DemandAdministrationViewProps,
  {}
> {
  handleOnSelectedBrandChange = (
    selectedBrandItem: DropdownItemBaseProps<BrandsSVC.Brand>
  ) => {
    this.props.setBrand(selectedBrandItem.datum);
    this.props.getBrandProductsByShelves(selectedBrandItem.datum.meta_id);
  };

  canRenderShelvesProductsTree() {
    return this.props.brandProductsGroupedByShelves &&
      this.props.brandProductsGroupedByShelves.data &&
      this.props.brandProductsGroupedByShelves.data.shelves &&
      !this.props.brandProductsGroupedByShelves.requestInProgress;
  }

  renderShelvesProductsTree() {
    if (this.props.brand) {
      if (this.canRenderShelvesProductsTree()) {
        return (
          <ShelvesProductsTree
            className="column-1-7"
            tree={this.props.brandProductsGroupedByShelves.data!}
          />
        );
      }
      return (
        <div className="column-1-7 productsAndShelvesSpinnerContainer">
          <demeter-global-spinner color="grey-gradient" />
        </div>
      );
    }
    return <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Please select a brand</div>;
  }

  render() {
    const { brand, brands, brandProductsGroupedByShelves } = this.props;

    const children = (childrenProps: DemandAdministrationViewProps) => (
      <React.Fragment>
        <Title
          style={{ paddingLeft: '12px' }}
        >
          {`Administration - ${getBrandProperty(brand, 'name')}`}
        </Title>
        <demeter-container
          class="container-general"
          label="General informations"
        >
          <div className="grid-content">
            <div className="column-1-3">
              <Body>Label:</Body>
              <Body mode="bold">{getBrandProperty(brand, 'name')}</Body>
            </div>
            <div className="column-5-7">
              <Body>Language:</Body>
              <Body mode="bold">
                {getBrandProperty(brand, 'language_code')}
              </Body>
            </div>

            <div className="column-1-3">
              <Body>Group name:</Body>
              <Body mode="bold">{getBrandProperty(brand, 'group_name')}</Body>
            </div>

            <div className="column-5-7">
              <Body>Localisation:</Body>
              <Body mode="bold">{getBrandProperty(brand, 'country_code')}</Body>
            </div>
          </div>
        </demeter-container>
        <demeter-container
          class="container-productsPerShelves"
          label="Brand products per shelves"
          bodypadding={!this.canRenderShelvesProductsTree()}
        >
          <div
            slot="description"
            style={{ paddingTop: '13px' }}
          >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet, orci vitae malesuada vehicula, ex elit accumsan nibh, quis mattis nunc velit a lorem. In eu nunc vel nibh accumsan semper.
          </div>
          <div className="grid-content">{this.renderShelvesProductsTree()}</div>
        </demeter-container>
      </React.Fragment>
    );
    const headerChildren = (headerProps: DemandAdministrationViewProps) => (
      <AreaHeader>
        <AreaHeader.Left
          style={{
            paddingLeft: '9px'
          }}
        >
          <Dropdown<BrandsSVC.Brand>
            identifier="currentBrand"
            mode={DropdownAttrMode.MENU}
            label="Brand"
            disabled={false}
            value={(brand && brand.meta_id) || undefined}
            noValueMessage="Select a brand"
            itemList={getBrandList(brands)}
            loadingMessage="Loading your brands..."
            onChange={this.handleOnSelectedBrandChange}
          />
        </AreaHeader.Left>
      </AreaHeader>
    );
    const validationChildren = (
      validationProps: DemandAdministrationViewProps
    ) => <div>validation</div>;

    return (
      <Content
        brand={brand}
        brands={brands}
        brandProductsGroupedByShelves={brandProductsGroupedByShelves.data}
        contentChildren={children}
        contentClass="demand-administration"
        headerChildren={headerChildren}
        validationChildren={validationChildren}
      >
      </Content>
    );
  }
}

function getBrandProperty(brand: BrandsSVC.Brand | null, prop: string) {
  const defaultValue = '--';
  if (brand && !_.isEmpty(brand)) {
    switch (prop) {
      case 'language_code': {
        return _.split(brand.language, '_')[0];
      }
      case 'country_code': {
        return _.split(brand.language, '_')[1];
      }
      case 'name': {
        return brand.name;
      }
      case 'group_name': {
        return (brand.group && brand.group.name) || defaultValue;
      }

      default: {
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

function getBrandList(brands: BrandsSVC.Brand[]): DropdownItemBaseProps<BrandsSVC.Brand>[] {
  const brandDropdownList = _.map(brands, brand => ({
    datum: brand,
    id: brand.meta_id,
    label: brand.name,
  }));
  return brandDropdownList;
}

export default DemandAdministrationView;
