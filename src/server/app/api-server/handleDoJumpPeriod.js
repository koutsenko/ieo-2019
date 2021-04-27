import playerMadeTurn from "server/app/actions/playerMadeTurn";
import playerSliceTurns from "server/app/actions/playerSliceTurns";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";
import buildNextTurnState from "server/app/utils/buildNextTurnState";

export default store => (socketId, data) => {
  let response = {
    success: false
  };

  const state = store.getState();
  const { login } = state.auth[socketId];
  const tss = state.game.players[login].turnStates;
  const lastState = tss[tss.length - 1];
  const { period } = data;
  const { scenario } = state;
  const { globalParams } = scenario;
  const gameStartPeriod = parseInt(globalParams["game start period"], 10);
  const retirementPeriod = parseInt(globalParams["retirement period"], 10);
  const currentPeriod = gameStartPeriod + lastState.turn - 1;

  let nextState;
  if (period < gameStartPeriod || period > retirementPeriod) {
    response.reason = "out of range";
  } else {
    if (currentPeriod > period) {
      const count = period - gameStartPeriod;
      store.dispatch(playerSliceTurns(login, 0, count + 1));

      const nextTss = store.getState().game.players[login].turnStates;
      nextState = nextTss[nextTss.length - 1];

      response.success = true;
      response.data = filterPast(filterFuture(nextState));
    } else if (currentPeriod < period) {
      const count = period - currentPeriod;

      // count раз сделать конец хода
      let nextState = lastState;
      for (var i = 0; i < count; i++) {
        nextState = buildNextTurnState(nextState, store);
        store.dispatch(playerMadeTurn(login, nextState));

        if (
          nextState.endByWin ||
          nextState.endByPension ||
          nextState.endByBankruptcy
        ) {
          break;
        }
      }

      response.success = true;
      response.data = filterPast(filterFuture(nextState));
    } else {
      response.reason = "requested same period, no changes";
    }
  }

  return response;
};
