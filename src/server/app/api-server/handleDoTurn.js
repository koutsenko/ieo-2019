import * as R from "ramda";

import playerMadeTurn from "server/app/actions/playerMadeTurn";
import buildNextTurnState from "server/app/utils/buildNextTurnState";
import checkNegativeBalance from "server/app/utils/checkNegativeBalance";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";

export default store => (socketId, data) => {
  const state = store.getState();
  const { auth, game } = state;
  const { login } = auth[socketId];
  const { forced } = data;

  const playerData = game.players[login];
  const { turnStates } = playerData;
  const lastState = R.last(turnStates);

  const response = {};

  // Если баланс отрицательный, возвращаем старое состояние.
  // К этому состоянию примешиваем одноразовый флаг на показ диалога.
  // Еще уберем флаг про margin call, т.к. юзер его уже видел.
  // Возможно в будущем сделаем более правильную логику.
  if (!forced && checkNegativeBalance(lastState)) {
    response.data = filterPast(
      filterFuture({
        ...lastState,
        negativeBalanceFlag: true,
        margin_call_last_data: null
      })
    );
    response.success = true;
  } else {
    const nextState = buildNextTurnState(lastState, store, forced);
    store.dispatch(playerMadeTurn(login, nextState));

    // FIXME move filterPast to scenario-level?
    response.data = filterPast(filterFuture(nextState));
    response.success = true;
  }

  return response;
};
