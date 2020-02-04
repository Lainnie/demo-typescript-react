import * as _ from 'lodash';
import * as React from 'react';

interface Styles {
  [key: string]: React.CSSProperties;
}

const allowMode = ['regular', 'medium', 'bold'];

const styles: Styles = {
  bold: {
    fontWeight: 700,
  },
  light: {
    fontWeight: 100,
  },
  medium: {
    fontWeight: 500,
  },
  regular: {
    fontWeight: 400,
  },
  text: {
    margin: 0,
    padding: 0,
  },
};

export interface Props {
  children: React.ReactNode;
  mode?: string;
  className?: string;
  fontSize: number;
  lineHeight?: string;
  style?: {
    [cssRule: string]: string,
  }
}

const Text = (props: Props) => {
  const mode =
    (_.includes(allowMode, props.mode) ? props.mode : 'regular') || 'regular';
  const style = {
    fontSize: props.fontSize,
    lineHeight: props.lineHeight,
    ...styles.text,
    ...styles[mode],
    ...(props.style ? props.style : {})
  };

  return (
    <p className={props.className} style={style}>
      {props.children}
    </p>
  );
};

export default Text;
