import * as React from 'react';

import { CSSTransition } from 'react-transition-group';

import { useLoading } from '../use';

interface Props {
  contentChildren?: any;
  contentClass: string;
  headerChildren?: any;
  validationChildren?: any;
  [otherProp: string]: any;
}

const Content = ({
  contentChildren,
  contentClass,
  headerChildren,
  validationChildren,
  otherProp,
}: Props) => {
  const headerClass = headerChildren ? 'header' : 'no-header';
  const loading = process.env.NODE_ENV === 'test' ? null : useLoading();

  return (
    <>
      {loading}
      <CSSTransition
        in={!loading}
        timeout={300}
        classNames="content-transition"
        unmountOnExit
      >
        <div className={`${contentClass} content-wrapper`}>
          <div className={headerClass}>
            {headerChildren && headerChildren(otherProp)}
          </div>
          <div className="content">
            {contentChildren && contentChildren(otherProp)}
          </div>
          <div className="validation">
            {validationChildren && validationChildren(otherProp)}
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default Content;
