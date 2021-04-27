import { SOCKET_PLAYER_CONNECTED } from "server/app/constants/actions";

export default (id, ws, ip) => ({
  type: SOCKET_PLAYER_CONNECTED,
  id,
  ip,
  ws
});
