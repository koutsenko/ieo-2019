import * as R from "ramda";

import playerMadeRevertOrders from "server/app/actions/playerMadeRevertOrders";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";

export default store => (socketId, data) => {
  const state = store.getState();
  const { auth } = state;
  const { login } = auth[socketId];
  let response = {};

  store.dispatch(playerMadeRevertOrders(login));

  const changedState = store.getState();
  const { game } = changedState;
  const playerData = game.players[login];
  const { turnStates } = playerData;
  const changedTurnState = R.last(turnStates);

  response.data = filterPast(filterFuture(changedTurnState));
  response.success = true;
  return response;
};
