import * as R from "ramda";

import {
  AUTHENTICATED_ADMIN,
  AUTHENTICATED_PLAYER,
  SOCKET_ADMIN_CONNECTED,
  SOCKET_PLAYER_CONNECTED,
  PLAYER_LOGOUT,
  ADMIN_LOGOUT
} from "server/app/constants/actions";

import {
  AUTH_ADMIN,
  AUTH_PLAYER,
  AUTH_UNKNOWN
} from "server/app/constants/states";

const defaultState = {};

export default (state = defaultState, action) => {
  const { type, id, login, demiurg, name, ip } = action;

  switch (type) {
    case PLAYER_LOGOUT:
    case ADMIN_LOGOUT:
    case SOCKET_ADMIN_CONNECTED:
    case SOCKET_PLAYER_CONNECTED: {
      const nextState = {
        ...state,
        [id]: {
          status: AUTH_UNKNOWN,
          ip
        }
      };

      return nextState;
    }

    case AUTHENTICATED_ADMIN: {
      const nextState = {
        ...state,
        [id]: {
          ...state[id],
          status: AUTH_ADMIN,
          login,
          name
        }
      };

      return nextState;
    }

    case AUTHENTICATED_PLAYER: {
      // Костыль - делаю неавторизованными другие сокеты игрока с таким именем
      const filteredState = Object.keys(state).reduce((acc, cur) => {
        const item = state[cur];
        const isSameId = item.id === id;
        const isPlayer = item.status === AUTH_PLAYER;
        const isSameLogin = item.login === login;
        const filter = !isSameId && isPlayer && isSameLogin;
        const result = filter ? acc : { ...acc, [cur]: item };

        return result;
      }, {});
      const nextState = {
        ...filteredState,
        [id]: {
          ...filteredState[id],
          status: AUTH_PLAYER,
          login,
          demiurg,
          name
        }
      };

      return nextState;
    }

    default:
      return state;
  }
};
