import { GAME_RESUMED } from "common/constants/notifications";
import { AUTH_PLAYER } from "server/app/constants/states";

export default state => {
  const { auth, socketpool } = state;
  const players = Object.keys(auth).filter(
    key => auth[key].status === AUTH_PLAYER
  );
  const sockets = players.map(key => socketpool[key]);

  if (sockets.length === 0) {
    return;
  }

  sockets.forEach(socket => {
    if (socket === undefined) {
      return;
    }

    try {
      socket.send(
        JSON.stringify({
          type: GAME_RESUMED
        })
      );
    } catch (error) {
      console.error("Error send to socket: ", error);
    }
  });
};
