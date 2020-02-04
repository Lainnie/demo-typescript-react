const ucFirst = (str: string): string => {
  if (str.length > 0) {
    return str[0].toUpperCase() + str.substring(1);
  } else {
    return str;
  }
};

export default ucFirst;
