export default store => () => {
  const state = store.getState();
  const data = state.game.status;
  const response = {
    success: true,
    data
  };

  return response;
};
