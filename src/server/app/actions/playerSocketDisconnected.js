import { SOCKET_PLAYER_DISCONNECTED } from "server/app/constants/actions";

export default id => ({
  type: SOCKET_PLAYER_DISCONNECTED,
  id
});
