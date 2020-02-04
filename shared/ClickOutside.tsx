import * as React from 'react';

interface ClickOutsideProps {
  onClickOutside: Function,
  [otherProp: string]: any,
}

export default class ClickOutside extends React.Component<ClickOutsideProps> {
  container: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  isTouch = false

  render() {
    const { children, onClickOutside, ...props } = this.props
    return (
      <div
        {...props}
        ref={this.container}
      >
        {children}
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('touchend', this.handle, true)
    document.addEventListener('click', this.handle, true)
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handle, true)
    document.removeEventListener('click', this.handle, true)
  }

  handle = (e: Event) => {
    if (e.type === 'touchend') {
      this.isTouch = true
    }
    if (e.type === 'click' && this.isTouch) {
      return
    }
    const { onClickOutside } = this.props
    const el = this.container.current
    if (el && !el.contains(e.target as Node)) {
      onClickOutside(e)
    }
  }
}