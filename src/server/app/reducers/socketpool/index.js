import {
  SOCKET_ADMIN_CONNECTED,
  SOCKET_ADMIN_DISCONNECTED,
  SOCKET_PLAYER_CONNECTED,
  SOCKET_PLAYER_DISCONNECTED
} from "server/app/constants/actions";

const defaultState = {};

export default (state = defaultState, action) => {
  const { type, id, ws } = action;

  switch (type) {
    case SOCKET_ADMIN_CONNECTED:
    case SOCKET_PLAYER_CONNECTED: {
      const nextState = {
        ...state,
        [id]: ws
      };

      return nextState;
    }

    case SOCKET_ADMIN_DISCONNECTED:
    case SOCKET_PLAYER_DISCONNECTED: {
      const nextState = { ...state };
      delete nextState[id];

      return nextState;
    }

    default:
      return state;
  }
};
