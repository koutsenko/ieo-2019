import { PLAYER_LOGOUT } from "server/app/constants/actions";

export default id => ({
  type: PLAYER_LOGOUT,
  id
});
