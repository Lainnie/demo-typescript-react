import * as React from 'react';
import './DropdownItem.css';

export interface DropdownItemBaseProps<T> {
  /** Unique identifier */
  id: string,
  /** Label to be displayed */
  label: string,
  /** Associated data: can be anything */
  datum: T,
}

export interface DropdownItemProps<T> extends DropdownItemBaseProps<T> {
  /** Called on selection */
  onSelection: (item: DropdownItemBaseProps<T>) => void,
}

class DropdownItem<T> extends React.Component<DropdownItemProps<T>> {
  handleOnClick = () => {
    this.props.onSelection({
      datum: this.props.datum,
      id: this.props.id,
      label: this.props.label,
    });
  }

  handleOnKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    this.handleOnClick();
  }

  render() {
    return (
      <div
        className="dropdownItemComp"
        role="menuitem"
        tabIndex={0}
        onKeyPress={this.handleOnKeyPress}
        onClick={this.handleOnClick}
      >
        {this.props.label}
      </div>
    );
  }
}

export default DropdownItem;