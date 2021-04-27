import { GAME_STATE_RUNNING } from "common/constants/states/game";
import buildTurnState from "server/app/utils/buildTurnState";
import { AUTH_PLAYER } from "server/app/constants/states";
import playerReset from "server/app/actions/playerReset";
import playerRevertOneTurn from "server/app/actions/playerRevertOneTurn";
import unicastGameState from "server/app/api-notifications/unicastGameState";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";

export default store => async data => {
  const state = store.getState();
  const { status } = state.game;

  const { login, dropOrders } = data;

  const response = {};

  if (status !== GAME_STATE_RUNNING) {
    response.success = false;
    response.reason = `Game is not running, nothing to revert`;
  } else {
    const playerData = state.game.players[login];
    if (playerData === undefined) {
      response.success = false;
      response.reason = `No player [${login}] state found. Did he enter the game?`;
    } else {
      // найти идентификатор сокета игрока
      const socketId = Object.keys(state.auth).find(
        id =>
          state.auth[id].login === login &&
          state.auth[id].status === AUTH_PLAYER
      );

      // что сбрасываем - первый ход или старый другой?
      const tss = state.game.players[login].turnStates;
      if (tss.length === 1) {
        // сгенерить новый первый ход
        const firstState = buildTurnState(store)(socketId);

        // стереть всю историю ходов и перезаписать её единственным новым
        store.dispatch(playerReset(login, firstState));

        // отослать новый ход
        unicastGameState(state, socketId, filterPast(filterFuture(firstState)));

        response.success = true;
      } else {
        // откатить один ход
        store.dispatch(playerRevertOneTurn(login, dropOrders));

        // предыдущий ход
        const pointer = tss[tss.length - 2];
        const prevState = {
          ...pointer,
          orders: dropOrders ? [] : pointer.orders
        };

        // отослать предыдущий ход
        unicastGameState(state, socketId, filterPast(filterFuture(prevState)));

        response.success = true;
      }
    }
  }

  // store.dispatch(gameStop());
  // broadcastGameStopped(state);
  // response.success = true;
  // response.data = GAME_STATE_NOT_RUNNING;

  return response;
};
