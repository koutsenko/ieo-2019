import playerJoined from "server/app/actions/playerJoined";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";
import buildTurnState from "server/app/utils/buildTurnState";

export default store => socketId => {
  const state = store.getState();
  const { auth, game } = state;
  const { login } = auth[socketId];

  let turnState;

  const playerData = game.players[login];
  if (playerData === undefined) {
    turnState = buildTurnState(store)(socketId);
    store.dispatch(playerJoined(login, turnState));
  } else {
    const { turnStates } = playerData;
    turnState = turnStates[turnStates.length - 1];
  }

  const response = {};
  response.data = filterPast(filterFuture(turnState));
  response.success = true;

  return response;
};
