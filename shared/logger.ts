/* eslint-disable no-console */
const separator = '\n=======\n';

const getTitle = (type: string) => `Athena ${type}:`;

const getMessage = (type: string, ...args: any) => [
  getTitle(type),
  separator,
  ...args,
  separator,
];

export const log = (...args: any) => {
  console.log(...getMessage('Log', ...args));
};

export const error = (...args: any) => {
  console.error(...getMessage('Error', ...args));
};

export const info = (...args: any) => {
  console.info(...getMessage('Info', ...args));
};
/* eslint-enable no-console */
