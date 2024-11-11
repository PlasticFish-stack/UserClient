export const resetReactiveState = (reactiveState, initialState) => {
  Object.keys(reactiveState).forEach(key => {
    if (initialState.hasOwnProperty(key)) {
      reactiveState[key] = initialState[key];
    }
  });
};

export const getKeyParams = (data, keys: string[] = []) => {
  return Object.keys(data).reduce((pre, key) => {
    return keys.includes(key)
      ? {
          ...pre,
          [key]: data[key]
        }
      : pre;
  }, {});
};
