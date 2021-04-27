import authenticatedAdmin from "server/app/actions/authenticatedAdmin";

export default store => (id, data) => {
  const state = store.getState();
  const { tokens } = state;
  const { token } = data;
  const response = {};

  if (Object.keys(tokens.admins).includes(token)) {
    const { login, name } = tokens.admins[token];
    store.dispatch(authenticatedAdmin(id, login, name));

    response.success = true;
    response.data = login;
  } else {
    response.success = false;
    response.reason = "Wrong token";
  }

  return response;
};
