import authenticatedAdmin from "server/app/actions/authenticatedAdmin";

export default store => (id, data) => {
  const state = store.getState();
  const { login, password } = data;
  const { admins } = state.accounts;
  const admin = admins.find(i => i.login === login && i.password === password);
  const exists = Boolean(admin);
  const response = {};

  if (exists) {
    store.dispatch(authenticatedAdmin(id, login, admin.name));

    response.success = true;
    response.data = id;
  } else {
    response.success = false;
    response.reason = "Wrong login or password";
  }

  return response;
};
