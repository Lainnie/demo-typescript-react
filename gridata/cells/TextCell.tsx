import * as React from 'react';

const TextCell = (props: any) => {
  const opacity = props.value.disabled === true ? 0.5 : 1;
  return <div style={{ opacity: opacity }}>{props.value.label}</div>;
};

export default TextCell;
