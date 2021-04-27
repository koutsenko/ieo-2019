import { SOCKET_ADMIN_DISCONNECTED } from "server/app/constants/actions";

export default id => ({
  type: SOCKET_ADMIN_DISCONNECTED,
  id
});
