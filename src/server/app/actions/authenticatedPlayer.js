import { AUTHENTICATED_PLAYER } from "server/app/constants/actions";

export default (id, login, demiurg, name) => ({
  type: AUTHENTICATED_PLAYER,
  id,
  login,
  demiurg,
  name
});
