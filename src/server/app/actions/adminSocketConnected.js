import { SOCKET_ADMIN_CONNECTED } from "server/app/constants/actions";

export default (id, ws, ip) => ({
  type: SOCKET_ADMIN_CONNECTED,
  id,
  ip,
  ws
});
