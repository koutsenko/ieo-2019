import playerLogout from "server/app/actions/adminLogout";

export default store => id => {
  store.dispatch(playerLogout(id));

  const response = {};
  response.success = true;

  return response;
};
