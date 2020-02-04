import * as React from 'react';
import { DmdAdministration } from 'olympus-anesidora';
import {
  GetShelfOpenState,
  ToggleShelfOpenState,
} from '../ShelvesProductsTree/ShelvesProductsTree';

import './ShelfContainer.css';

interface ShelfContainerProps {
  level: number;
  datum: DmdAdministration.ShelfIdValue;
  getOpenState: GetShelfOpenState;
  toggleOpenState: ToggleShelfOpenState;
}

interface ShelfProps {
  level: number;
  datum: DmdAdministration.ShelfIdValue;
  isOpen: boolean;
  getOpenState: GetShelfOpenState;
  toggleOpenState: ToggleShelfOpenState;
}

class Shelf extends React.Component<ShelfProps, {}> {
  getRootClassName() {
    return `shelfComp ${this.props.isOpen ? ' isOpen' : 'isClosed'} level-${
      this.props.level
    }`;
  }

  handleOnShelfHeadClick = () => {
    this.props.toggleOpenState(this.props.datum);
  };

  handleOnShelfKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      this.handleOnShelfHeadClick();
    }
  }

  getMProducts() {
    return Object.values(this.props.datum.mProducts);
  }

  renderMProducts() {
    const mProducts = this.getMProducts();
    if (mProducts && mProducts.length) {
      return (
        <div className="mProductList">
          {mProducts.map(mProduct => (
            <div
              className="mProduct"
              key={`shelf#${mProduct.shelf_id}-mproduct#${mProduct.id}`}
            >
              {mProduct.name}
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  getChildrenShelves() {
    return Object.values(this.props.datum.shelves);
  }

  renderChildrenShelves() {
    const childrenShelves = this.getChildrenShelves();

    if (childrenShelves && childrenShelves.length) {
      return (
        <div className="childrenShelvesList">
          {childrenShelves.map(childShelf => (
            <ShelfContainer
              key={`shelf#${this.props.datum.shelf.id}-child#${
                childShelf.shelf.id
              }`}
              level={this.props.level + 1}
              datum={childShelf}
              getOpenState={this.props.getOpenState}
              toggleOpenState={this.props.toggleOpenState}
            />
          ))}
        </div>
      );
    }

    return null;
  }

  renderIcon() {
    const icon = `fal fa-angle-${this.props.isOpen ? 'down' : 'right'} fa-lg`;

    return <i className={icon} />;
  }

  render() {
    return (
      <div className={this.getRootClassName()}>
        <div
          className="head"
          role="button"
          tabIndex={0}
          onClick={this.handleOnShelfHeadClick}
          onKeyPress={this.handleOnShelfKeyPress}
        >
          {this.renderIcon()}
          <div>{this.props.datum.shelf.name}</div>
        </div>
        <div className="body">
          {this.renderMProducts()}
          {this.renderChildrenShelves()}
        </div>
      </div>
    );
  }
}

function ShelfContainer(props: ShelfContainerProps) {
  return (
    <Shelf
      level={props.level}
      datum={props.datum}
      isOpen={props.getOpenState(props.datum.shelf.id)}
      getOpenState={props.getOpenState}
      toggleOpenState={props.toggleOpenState}
    />
  );
}

export default ShelfContainer;
