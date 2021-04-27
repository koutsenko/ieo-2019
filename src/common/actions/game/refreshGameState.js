import { REFRESH_GAME_STATE } from "common/constants/actions";

const refreshGameState = gameState => ({
  type: REFRESH_GAME_STATE,
  gameState
});

export default refreshGameState;
