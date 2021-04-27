import nanoid from "nanoid";

import adminSocketConnected from "server/app/actions/adminSocketConnected";
import adminSocketDisconnected from "server/app/actions/adminSocketDisconnected";
import handleMessage from "server/ws/handleMessage";

export default (store, ip) => ws => {
  const socketId = nanoid();

  store.dispatch(adminSocketConnected(socketId, ws, ip));

  ws.on("close", (reasonCode, description) => {
    store.dispatch(adminSocketDisconnected(socketId));
  });

  ws.on("message", handleMessage("admin", socketId, ws, store));
};
