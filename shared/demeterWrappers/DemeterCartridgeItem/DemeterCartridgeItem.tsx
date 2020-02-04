import * as React from 'react';

export interface DemeterCartridgeItemPropItem<D> {
  id: string,
  label: string,
  datum: D,
}

interface DemeterCartridgeItemProps<D, P, I> {
  item: DemeterCartridgeItemPropItem<D> & I;
  /**
   * Called on deletion click
   */
  onDeletion: (item: DemeterCartridgeItemPropItem<D> & I) => void;
  /**
   * Allows to render what you want inside
   */
  render?: (props: DemeterCartridgeItemProps<D,P,I> & P & { cartridgeItemRef:React.RefObject<HTMLElement>}) => React.ReactNode;
}

export class DemeterCartridgeItem<D = any,P = {}, I = {}> extends React.PureComponent<DemeterCartridgeItemProps<D, P, I> & P> {
  cartridgeItem: React.RefObject<HTMLElement> = React.createRef<HTMLElement>();

  onDeletion = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    this.props.onDeletion(this.props.item);
  }

  componentDidMount() {
    if (this.cartridgeItem.current!) {
      this.cartridgeItem.current!.addEventListener(
        'demeter-cartridge-item-deleted-group-inform',
        this.onDeletion
      );

    }
  }

  componentWillUnmount() {
    if (this.cartridgeItem.current!) {
      this.cartridgeItem.current!.removeEventListener(
        'demeter-cartridge-item-deleted-group-inform',
        this.onDeletion
      );
    }
  }

  render() {
    return (
      <div className="cartridge-item">
        <demeter-cartridge-item
          ref={this.cartridgeItem}
          id={this.props.item.id}
          label={this.props.item.label}
          value={this.props.item.id}
        >
          {this.props.render
            ? this.props.render({
              ...this.props,
              cartridgeItemRef: this.cartridgeItem,
            })
            : null
          }
        </demeter-cartridge-item>
      </div>
    )
  }
}
