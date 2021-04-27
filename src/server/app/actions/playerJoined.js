import { PLAYER_JOINED_GAME } from "server/app/constants/actions";

export default (login, turnState) => ({
  login,
  turnState,
  type: PLAYER_JOINED_GAME
});
