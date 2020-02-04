import * as React from 'react';
import { DmdAdministration } from 'olympus-anesidora';
import { ShelfContainer } from '../ShelfContainer';
import './ShelvesProductsTree.css';

interface ShelvesProductsTreeProps {
  className?: string;
  tree: {
    shelves: DmdAdministration.MProductsByShelvesTree;
  };
}

interface ShelvesProductsTreeState {
  shelves: GenerateInitialStateOutput;
}

const getIdsFromShelvesObj = (
  shelvesObj: DmdAdministration.MProductsByShelvesTree
) => {
  return Object.entries(shelvesObj).reduce(
    (result: string[], [shelfId, shelfIdValue]) => {
      let tmpResult = [...result];

      // Add current shelf id if not already added
      if (!tmpResult.includes(shelfId)) {
        tmpResult = [...tmpResult, shelfId];
      }

      // Check if children shelves are present & add them if necessary
      if (shelfIdValue.shelves && Object.keys(shelfIdValue.shelves).length) {
        const childrenShelvesIds = getIdsFromShelvesObj(shelfIdValue.shelves);
        for (const childShelfId of childrenShelvesIds) {
          if (!tmpResult.includes(childShelfId)) {
            tmpResult = [...tmpResult, childShelfId];
          }
        }
      }

      return tmpResult;
    },
    []
  );
};

interface GenerateInitialStateOutput {
  [shelfId: string]: boolean;
}
const generateInitialState: (tree: {
  shelves: DmdAdministration.MProductsByShelvesTree;
}) => GenerateInitialStateOutput = tree => {
  if (tree && tree.shelves) {
    const allShelvesIds = getIdsFromShelvesObj(tree.shelves);

    if (allShelvesIds && allShelvesIds.length) {
      return allShelvesIds.reduce((result, shelfId) => {
        return {
          ...result,
          [shelfId]: false,
        };
      }, {});
    }
  }

  return {};
};

export type GetShelfOpenState = (shelfId: string) => boolean;
export type ToggleShelfOpenState = (
  shelfIdValue: DmdAdministration.ShelfIdValue
) => void;

const rootDefaultClass = 'shelvesProductsTreeComp';

class ShelvesProductsTree extends React.PureComponent<
  ShelvesProductsTreeProps,
  ShelvesProductsTreeState
> {
  state: ShelvesProductsTreeState = {
    shelves: {},
  };

  getShelfOpenState: GetShelfOpenState = shelfId => {
    if (this.state.shelves[shelfId] !== undefined) {
      return this.state.shelves[shelfId];
    }
    return false;
  };

  toggleShelfOpenState: ToggleShelfOpenState = shelfIdValue => {
    this.setState(state => {
      const currentShelfId = shelfIdValue.shelf.id;
      const nextShelfState = !state.shelves[currentShelfId];
      let nextChildrenShelvesStates = {};

      // If next shelf state is false, meaning close,
      // then close all children shelves as well
      if (!nextShelfState) {
        const childrenShelvesIds = getIdsFromShelvesObj(shelfIdValue.shelves);
        nextChildrenShelvesStates = childrenShelvesIds.reduce(
          (result, childShelfId) => ({
            ...result,
            [childShelfId]: false,
          }),
          {}
        );
      }

      return {
        ...state,
        shelves: {
          ...state.shelves,
          [currentShelfId]: nextShelfState,
          ...nextChildrenShelvesStates,
        },
      };
    });
  };

  renderItems() {
    if (this.props.tree && this.props.tree.shelves) {
      return Object.entries(this.props.tree.shelves).map(
        ([shelfId, shelfIdValue]: [string, DmdAdministration.ShelfIdValue]) => (
          <ShelfContainer
            key={shelfId}
            level={shelfIdValue.shelf.level}
            datum={shelfIdValue}
            getOpenState={this.getShelfOpenState}
            toggleOpenState={this.toggleShelfOpenState}
          />
        )
      );
    }
    return null;
  }

  componentDidMount() {
    const initialState = generateInitialState(this.props.tree);
    this.setState(state => ({
      shelves: initialState,
    }));
  }

  getRootClassName() {
    if (this.props.className) {
      return `${rootDefaultClass} ${this.props.className}`;
    }
    return rootDefaultClass;
  }

  render() {
    return <div className={this.getRootClassName()}>{this.renderItems()}</div>;
  }
}

export default ShelvesProductsTree;
