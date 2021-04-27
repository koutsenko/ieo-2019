import * as R from "ramda";

import applyOrders from "common/calc/applyOrders";
import checkOrder from "server/app/utils/checkOrder";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";
import playerMadeOrder from "server/app/actions/playerMadeOrder";

export default store => (socketId, orderData) => {
  const state = store.getState();
  const { auth, scenario, game } = state;
  const { instruments } = scenario;
  const { players } = game;
  const { login } = auth[socketId];
  const { turnStates } = players[login];
  const orderedTurnState = applyOrders(R.last(turnStates));

  let response = {};

  const result = checkOrder(instruments, orderedTurnState, orderData);
  if (!result.success) {
    response = result;
    return response;
  }

  store.dispatch(playerMadeOrder(login, orderData));

  const changedTurnStates = store.getState().game.players[login].turnStates;
  const changedTurnState = R.last(changedTurnStates);
  response.data = filterPast(filterFuture(changedTurnState));
  response.success = true;

  return response;
};
