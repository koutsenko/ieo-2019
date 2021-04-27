import { TOGGLE_SOCKET_STATUS } from "common/constants/actions";

const toggleSocketStatus = status => ({
  status,
  type: TOGGLE_SOCKET_STATUS
});

export default toggleSocketStatus;
