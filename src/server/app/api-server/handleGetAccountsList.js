export default store => () => {
  const state = store.getState();
  const response = {};

  response.success = true;
  // all can play?
  response.data = [...state.accounts.players];
  // response.data = [...state.accounts.admins, ...state.accounts.players];

  return response;
};
