import gameStarted from "server/app/actions/gameStart";
import broadcastGameStarted from "server/app/api-notifications/broadcastGameStarted";
import { GAME_STATE_RUNNING } from "common/constants/states/game";

export default store => () => {
  const state = store.getState();
  const { status } = state.game;
  const response = {};

  if (status === GAME_STATE_RUNNING) {
    response.success = false;
    response.reason = "Already started";
  } else {
    store.dispatch(gameStarted());
    broadcastGameStarted(state);
    response.success = true;
    response.data = GAME_STATE_RUNNING;
  }

  return response;
};
