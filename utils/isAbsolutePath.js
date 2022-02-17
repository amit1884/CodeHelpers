const isAbsolutePath = (value) => {
  const result = /https?:\/\/.+/.test(value);
  return result;
};

export default isAbsolutePath;
