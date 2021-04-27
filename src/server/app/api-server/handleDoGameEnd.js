import playerMadeTurn from "server/app/actions/playerMadeTurn";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";
import buildNextTurnState from "server/app/utils/buildNextTurnState";
import unicastGameState from "server/app/api-notifications/unicastGameState";
import { AUTH_PLAYER } from "server/app/constants/states";

export default store => () => {
  let response = {
    success: true
  };

  const state = store.getState();
  const { scenario } = state;
  const { globalParams } = scenario;
  const retirementPeriod = parseInt(globalParams["retirement period"], 10);
  const gameStartPeriod = parseInt(globalParams["game start period"], 10);
  const period = retirementPeriod;

  try {
    Object.keys(state.game.players).forEach(login => {
      const tss = state.game.players[login].turnStates;
      const lastState = tss[tss.length - 1];

      // Если игрок уже закончил, не трогаем его.
      if (
        lastState.endByBankruptcy ||
        lastState.endByWin ||
        lastState.endByPension
      ) {
        return;
      }

      const currentPeriod = gameStartPeriod + lastState.turn - 1;
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

      // Отправить игроку.
      const socketId = Object.keys(state.auth).find(
        id =>
          state.auth[id].login === login &&
          state.auth[id].status === AUTH_PLAYER
      );
      // отослать предыдущий ход
      unicastGameState(state, socketId, filterPast(filterFuture(nextState)));
    });
  } catch (error) {
    response = {
      success: false,
      reason: "Something breaks"
    };
  }

  return response;
};
