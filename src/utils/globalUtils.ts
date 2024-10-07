export const resetReactiveState = (reactiveState, initialState) => {
  Object.keys(reactiveState).forEach(key => {
    if (initialState.hasOwnProperty(key)) {
      reactiveState[key] = initialState[key];
    }
  });
};
