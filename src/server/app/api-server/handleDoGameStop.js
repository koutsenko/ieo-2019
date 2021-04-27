import gameStop from "server/app/actions/gameStop";
import broadcastGameStopped from "server/app/api-notifications/broadcastGameStopped";
import { GAME_STATE_NOT_RUNNING } from "common/constants/states/game";

export default store => () => {
  const state = store.getState();
  const { status } = state.game;
  const response = {};

  if (status === GAME_STATE_NOT_RUNNING) {
    response.success = false;
    response.reason = "Already stopped";
  } else {
    store.dispatch(gameStop());
    broadcastGameStopped(state);
    response.success = true;
    response.data = GAME_STATE_NOT_RUNNING;
  }

  return response;
};
