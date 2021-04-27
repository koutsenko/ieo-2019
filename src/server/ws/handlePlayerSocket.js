import nanoid from "nanoid";

import playerSocketConnected from "server/app/actions/playerSocketConnected";
import playerSocketDisconnected from "server/app/actions/playerSocketDisconnected";
import handleMessage from "server/ws/handleMessage";

export default (store, ip) => ws => {
  const socketId = nanoid();

  store.dispatch(playerSocketConnected(socketId, ws, ip));

  ws.on("close", (reasonCode, description) => {
    store.dispatch(playerSocketDisconnected(socketId));
  });

  ws.on("message", handleMessage("player", socketId, ws, store));
};
