import { PLAYER_REVERT_ONE_TURN } from "server/app/constants/actions";

export default (login, dropOrders) => ({
  login,
  dropOrders,
  type: PLAYER_REVERT_ONE_TURN
});
