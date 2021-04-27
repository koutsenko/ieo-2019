import { PLAYER_RESET } from "server/app/constants/actions";

export default (login, turnState) => ({
  login,
  turnState,
  type: PLAYER_RESET
});
