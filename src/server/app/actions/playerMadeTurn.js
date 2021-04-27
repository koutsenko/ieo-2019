import { PLAYER_MADE_TURN } from "server/app/constants/actions";

export default (login, turnState) => ({
  login,
  turnState,
  type: PLAYER_MADE_TURN
});
