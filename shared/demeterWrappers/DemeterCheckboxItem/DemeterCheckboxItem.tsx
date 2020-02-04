import * as React from 'react';

export interface DemeterCheckboxItemPropItem<D> {
  id: string,
  label: string,
  datum: D,
  [otherAttr: string]: any,
};

type DatumFuncBool<D> = (item: DemeterCheckboxItemPropItem<D>) => boolean;

interface DemeterCheckboxItemProps<D> {
  className?: string,
  item: DemeterCheckboxItemPropItem<D>,
  onClick: (item: DemeterCheckboxItemPropItem<D>) => void,
  disabled: boolean|DatumFuncBool<D>,
  checked: boolean|DatumFuncBool<D>
}

export class DemeterCheckboxItem<D> extends React.PureComponent<DemeterCheckboxItemProps<D>> {
  checkboxItemRef: React.RefObject<HTMLElement> = React.createRef<HTMLElement>();
  static defaultProps = {
    disabled:false,
    checked: false,
  }

  componentDidMount() {
    if (this.checkboxItemRef.current!) {
      this.checkboxItemRef.current!.addEventListener(
        'demeter-checkbox-item-checked-group-inform',
        this.onItemCheckGroupInform
      );
    }
  }

  onItemCheckGroupInform = (event: CustomEvent) => {
    event.stopImmediatePropagation();

    if (!this.getDisabled()) {
      this.props.onClick(this.props.item);
    }
  }

  componentWillUnmount() {
    if (this.checkboxItemRef.current!) {
      this.checkboxItemRef.current!.removeEventListener(
        'demeter-checkbox-item-checked-group-inform',
        this.onItemCheckGroupInform
      );
    }
  }

  getDisabled() {
    if (typeof this.props.disabled === 'function') {
      return this.props.disabled(this.props.item);
    }
    return this.props.disabled;
  }

  getChecked() {
    if (typeof this.props.checked === 'function') {
      return this.props.checked(this.props.item);
    }
    return this.props.checked;
  }

  render() {
    return (
      <div className="checkbox-item">
        <demeter-checkbox-item
          ref={this.checkboxItemRef}
          class={this.props.className}
          identifier={this.props.item.id}
          value={this.props.item.id}
          checked={`${this.getChecked()}`}
          disabled={`${this.getDisabled()}`}
        >
          {this.props.item.label}
        </demeter-checkbox-item>
      </div>
    );
  }
}