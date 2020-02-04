import * as _ from 'lodash';

//
//  Creates Constants from string[]
//  It can take a namespace as a first argument
//  It can take a custom separator as a third argument default('/')
//
export type Ikeymirror = (
  prefix: string,
  keys: string[],
  separator?: string
) => { [key: string]: string };

const keymirror: Ikeymirror = (prefix, keys, separator = '/') => {
  const namespace = prefix ? `${prefix}${separator}` : '';

  return _.reduce(
    keys,
    (acc, key) => ({ ...acc, [key]: `[${namespace}] ${key}` }),
    {}
  );
};

export default keymirror;
