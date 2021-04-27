import { TOGGLE_AUTHORIZED } from "common/constants/actions";

const toggleAuthorized = (status, login) => ({
  type: TOGGLE_AUTHORIZED,
  status,
  login
});

export default toggleAuthorized;
