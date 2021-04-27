import authenticatedPlayer from "server/app/actions/authenticatedPlayer";

export default store => (id, data) => {
  const state = store.getState();
  const { login, password } = data;
  const { players } = state.accounts;
  const p = players.find(i => i.login === login && i.password === password);
  const exists = Boolean(p);
  const response = {};

  if (exists) {
    store.dispatch(authenticatedPlayer(id, login, p.demiurg === "1", p.name));

    response.success = true;
    response.data = id;
  } else {
    response.success = false;
    response.reason = "Wrong login or password";
  }

  return response;
};
