import playerReset from "server/app/actions/playerReset";
import buildTurnState from "server/app/utils/buildTurnState";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";
import unicastGameState from "server/app/api-notifications/unicastGameState";

const oneLife = "Replay not allowed. You have 1 life.";

export default store => socketId => {
  const state = store.getState();
  const { auth, game } = state;
  const { login } = auth[socketId];
  const playerData = game.players[login];
  const { turnStates } = playerData;
  const lastState = turnStates[turnStates.length - 1];
  const { can_replay } = lastState;
  const response = {};

  if (!can_replay) {
    response.success = false;
    response.reason = oneLife;
  } else if (
    lastState.endByWin ||
    lastState.endByPension ||
    lastState.endByBankruptcy
  ) {
    setTimeout(() => {
      try {
        const state = store.getState();
        const firstState = buildTurnState(store)(socketId); // сгенерить новый первый ход
        store.dispatch(playerReset(login, firstState)); // стереть всю историю ходов и перезаписать её единственным новым
        unicastGameState(state, socketId, filterPast(filterFuture(firstState)));
      } catch (error) {
        console.error(
          "Error starting new game again for single player: ",
          error
        );
      }
    });
    response.success = true;
  } else {
    response.success = false;
    response.reason = oneLife;
  }

  return response;
};
