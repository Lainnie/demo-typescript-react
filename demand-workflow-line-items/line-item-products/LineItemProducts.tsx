import * as _ from 'lodash';
import * as React from 'react';
import { MeccaSVC } from 'olympus-anesidora';
import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../../shared/Dropdown';
import { useContainerLabelStepper } from '../../shared/use';
import { LineItemContext, LineItemSectionProps } from '../CommonDemandWorkflowLineItem';

import './LineItemProducts.css';
import {
  DemeterInputText,
  DemeterCartridgeItem,
  DemeterCartridgeItemPropItem,
} from '../../shared/demeterWrappers';
import { useMProducts } from '../use';

interface LineItemProductsProps extends LineItemSectionProps {
}

function LineItemProducts(props: LineItemProductsProps) {
  const lineItemState = React.useContext(LineItemContext);
  const mProductsList = useMProducts();

  const ContainerStepper = useContainerLabelStepper('Products', 3);

  function onDeleteProduct(
    item: DemeterCartridgeItemPropItem<MeccaSVC.MProduct>
  ) {
    props.updateFieldState({
      mProducts: _.filter(
        lineItemState.fieldsState.mProducts,
        product => {
          return product.id !== item.datum.id;
        }
      ),
    });
  }

  function onProductSelected(
    newProduct: DropdownItemBaseProps<MeccaSVC.MProduct>
  ) {
    props.updateFieldState({
      mProducts: [
        ...lineItemState.fieldsState.mProducts,
        newProduct,
      ],
    });
  }

  function getProductList() {
    return _.chain(mProductsList.data)
      .filter(product => {
        return !_.find(
          lineItemState.fieldsState.mProducts,
          selected => selected.id === product.id
        );
      })
      .map(product => ({
        datum: product,
        id: product.id || '',
        label: product.name || '',
      }))
      .value();
  }

  function displayProducts() {
    return _.map(
      lineItemState.fieldsState.mProducts,
      dropdownMProduct => (
        <DemeterCartridgeItem<MeccaSVC.MProduct, {}, {}>
          key={dropdownMProduct.id}
          onDeletion={onDeleteProduct}
          item={dropdownMProduct}
        />
      )
    );
  }

  return (
    <demeter-container class="line-item-products" label="Products">
      <div className="inputs">
        <Dropdown
          identifier="currentProduct"
          mode={DropdownAttrMode.FORM}
          label="Products list"
          disabled={false}
          noValueMessage="Search your product"
          itemList={getProductList()}
          loading={mProductsList.requestInProgress}
          loadingMessage="Loading products"
          helper={
            'Select product in the list and add it. Repeat to add another product.'
          }
          onChange={onProductSelected}
        />
      </div>

      <div className="products">{displayProducts()}</div>

      <ContainerStepper />
      <p className="description" slot="description">
        Select the products you want to promote in the formats of this line
        item.
      </p>
    </demeter-container>
  );
}

export default LineItemProducts;
