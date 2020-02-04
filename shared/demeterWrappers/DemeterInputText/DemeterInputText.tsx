import * as React from 'react';

export interface DemeterInputTextPropItem<D> {
  datum: D,
}

interface DemeterInputTextProps<D=any,P={},I={}> {
  identifier: string;
  /** Disabled state: behaves similarly to input/button disabled attribute */
  disabled?: string | boolean;
  /** Transposed to a real label */
  label: string;
  /** Similar to the input placeholder but appears below. Overriden by error */
  helper?: string;
  /** If passed, the field is styled in red. */
  error?: string;
  /** Passed to internal input's placeholder attribute */
  placeholder?: string;
  /**
   * TEXT = 'text' => Same as an input of type text
   * PASSWORD = 'password => Same as an input of type password
   */
  type?: 'text'|'password';
  item: DemeterInputTextPropItem<D> & I,
  /**
   * Allows to control the element similarly to the native input.
   */
  value?: string;
  /**
   * [OVERRIDES 'value' prop]
   *
   * Allows to control the element similarly to the native input.
   */
  getValue?: (item: DemeterInputTextPropItem<D> & I) => string
  /** Called on value change */
  onChange?: (item: DemeterInputTextPropItem<D> & I, newVal: string) => void,
}

export class DemeterInputText<D=any,P={},I={}> extends React.PureComponent<DemeterInputTextProps<D,P,I>> {
  private inputTextRef: React.RefObject<HTMLElement> = React.createRef<HTMLElement>();
  static defaultProps: Partial<DemeterInputTextProps> = {
    error: '',
    helper: '',
    type: 'text',
  }

  componentDidMount() {
    if (this.inputTextRef.current!) {
      this.inputTextRef.current!.addEventListener(
        'demeter-input-change',
        this.handleOnInputTextChange
      );
    }
  }

  componentWillUnmount() {
    if (this.inputTextRef.current!) {
      this.inputTextRef.current!.removeEventListener(
        'demeter-input-change',
        this.handleOnInputTextChange
      );
    }
  }

  handleOnInputTextChange = (e: CustomEvent) => {
    e.stopImmediatePropagation();
    const currentValue = e.detail.value;
    if (this.props.onChange) {
      this.props.onChange(this.props.item, currentValue);
    }
  };

  getValue() {
    if (this.props.getValue) {
      return this.props.getValue(this.props.item);
    }
    return this.props.value || undefined;
  }

  render() {
    return (
      <demeter-input-text
        ref={this.inputTextRef}
        identifier={this.props.identifier}
        disabled={this.props.disabled}
        label={this.props.label}
        helper={this.props.helper}
        error={this.props.error}
        type={this.props.type}
        value={this.getValue()}
        placeholder={this.props.placeholder}
      />
    );
  }
}
