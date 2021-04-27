import authenticatedPlayer from "server/app/actions/authenticatedPlayer";

export default store => (id, data) => {
  const state = store.getState();
  const { tokens } = state;
  const { token } = data;
  const response = {};

  if (Object.keys(tokens.players).includes(token)) {
    const { login, demiurg, name } = tokens.players[token];
    store.dispatch(authenticatedPlayer(id, login, demiurg, name));

    response.success = true;
    response.data = login;
  } else {
    response.success = false;
    response.reason = "Wrong token";
  }

  return response;
};
