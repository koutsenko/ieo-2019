export default store => () => {
  const state = store.getState();
  const data = state.scenario;
  const response = {
    success: true,
    data
  };

  return response;
};
