import { PLAYER_MADE_ORDER } from "server/app/constants/actions";

export default (login, order) => ({
  login,
  order,
  type: PLAYER_MADE_ORDER
});
