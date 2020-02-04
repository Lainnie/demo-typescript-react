import * as _ from 'lodash';
import * as React from 'react';
import ClickOutside from '../ClickOutside';
import DropdownItem, { DropdownItemBaseProps } from './Item/DropdownItem';
import './Dropdown.css';

export enum DropdownAttrMode {
  /** For usage in form: more stylish */
  FORM = 'form',
  /** For usage as basic dropdown menu */
  MENU = 'menu',
}

interface DropdownProps<T> {
  /** Class to be passed to the root element */
  className?: string;

  /** Overriding style for the root element */
  style?: {
    [cssRule: string]: string;
  };
  /** Similar to a input name: allows to identify uniquely an input */
  identifier: string;
  /** Presentation mode */
  mode: DropdownAttrMode;
  /** Label */
  label: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading: boolean;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Currently selected item id */
  value: string;
  /** Message to be displayed when nothing is selected */
  noValueMessage: string;
  /** The complete list of items */
  itemList: DropdownItemBaseProps<T>[];
  /** Message to be displayed when the list is loading (Ex: Loading your data...) */
  loadingMessage?: string;
  /** Called on item selection/click */
  onChange: (selectedItem: DropdownItemBaseProps<T>) => void;
}

interface DropdownState {
  /** Whether the component is focused or not */
  focused: boolean;
  open: boolean;
}

const defaultProps: Partial<DropdownProps<{ [datumProp: string]: any }>> = {
  disabled: false,
  loading: false,
  loadingMessage: 'Loading data...',
  noValueMessage: 'No data',
  mode: DropdownAttrMode.FORM,
};

class Dropdown<T> extends React.PureComponent<DropdownProps<T>, DropdownState> {
  static defaultProps = defaultProps;
  state = {
    focused: false,
    open: false,
  };

  isItemListEmpty() {
    return !(this.props.itemList && this.props.itemList.length);
  }

  renderLabel() {
    if (this.props.label) {
      return <label htmlFor={this.props.identifier}>{this.props.label}</label>;
    }
    return null;
  }

  getDownArrowIconSize() {
    return this.props.mode === DropdownAttrMode.FORM ? 24 : 14;
  }

  renderIcon() {
    if (this.props.loading)
      return <i className="fal fa-spinner-third fa-spin" />;
    return <i className="fal fa-angle-down" />;
  }

  getSelectedItemLabel() {
    if (this.props.loading) return this.props.loadingMessage;
    if (this.getSelectedItem()) return this.getSelectedItem()!.label;
    return this.props.noValueMessage;
  }

  getSelectedItem() {
    if (this.props.value && !this.isItemListEmpty()) {
      return _.find(this.props.itemList, item => item.id === this.props.value);
    }
    return null;
  }

  renderCurrentSelection() {
    return (
      <div className="dropdownComp-currentSelection">
        <span>{this.getSelectedItemLabel()}</span>
        {this.renderIcon()}
      </div>
    );
  }

  renderUnderline() {
    return <div className="dropdownComp-underline" />;
  }

  renderHelper() {
    if (!this.props.error && this.props.helper) {
      return <div className="dropdownComp-helper">{this.props.helper}</div>;
    }
    return null;
  }

  renderError() {
    if (this.props.error) {
      return <div className="dropdownComp-error">{this.props.error}</div>;
    }
    return null;
  }

  handleOnItemSelection = (item: DropdownItemBaseProps<T>) => {
    this.props.onChange(item);
  };

  renderItemList() {
    return (
      <div className="dropdownComp-itemListContainer" role="menu">
        {_.map(this.props.itemList, item => (
          <DropdownItem<T>
            key={item.id}
            id={item.id}
            label={item.label}
            datum={item.datum}
            onSelection={this.handleOnItemSelection}
          />
        ))}
      </div>
    );
  }

  getClassName() {
    return `dropdownComp${
      this.props.className ? ` ${this.props.className}` : ''
    }${this.props.disabled ? ' isDisabled' : ' isNotDisabled'}${
      this.props.error ? ' withError' : ' withoutError'
    }${this.props.mode === DropdownAttrMode.FORM ? ' modeForm' : ' modeMenu'}${
      this.state.open ? ' open' : ''
    }`;
  }

  handleOnFocus = () => {
    this.setState(state => ({
      ...state,
      focused: true,
    }));
  };

  handleOnBlur = () => {
    this.setState(state => ({
      ...state,
      focused: false,
    }));
  };

  setOpenState(newVal: boolean) {
    this.setState(state => ({
      ...state,
      open: newVal,
    }));
  }

  toggleOpenState() {
    if (!this.props.disabled) {
      this.setOpenState(!this.state.open);
    }
  }

  handleOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.toggleOpenState();
  };

  handleOnKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      this.toggleOpenState();
    }
  };

  handleOnClickOutside = () => {
    this.setOpenState(false);
  };

  render() {
    return (
      <ClickOutside
        onClickOutside={this.handleOnClickOutside}
        id={this.props.identifier}
        style={this.props.style}
        className={this.getClassName()}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={this.state.open}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        onClick={this.handleOnClick}
        onKeyPress={this.handleOnKeyPress}
      >
        {this.renderLabel()}
        {this.renderCurrentSelection()}
        {this.renderUnderline()}
        {this.renderItemList()}
        {this.renderHelper()}
        {this.renderError()}
      </ClickOutside>
    );
  }
}

export default Dropdown;
