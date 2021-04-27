import { AUTHENTICATED_ADMIN } from "server/app/constants/actions";

export default (id, login, name) => ({
  type: AUTHENTICATED_ADMIN,
  id,
  login,
  name
});
