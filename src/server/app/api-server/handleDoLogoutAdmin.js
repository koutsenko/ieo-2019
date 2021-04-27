import adminLogout from "server/app/actions/adminLogout";

export default store => id => {
  store.dispatch(adminLogout(id));

  const response = {};
  response.success = true;

  return response;
};
