import {
  AUTHENTICATED_ADMIN,
  AUTHENTICATED_PLAYER,
  PLAYER_LOGOUT,
  ADMIN_LOGOUT
} from "server/app/constants/actions";

const defaultState = {
  admins: {},
  players: {}
};

export default (state = defaultState, action) => {
  const { type, id, login, demiurg, name } = action;

  switch (type) {
    case AUTHENTICATED_ADMIN: {
      const nextState = {
        ...state,
        admins: {
          ...state.admins,
          [id]: { login, name }
        }
      };

      return nextState;
    }

    case AUTHENTICATED_PLAYER: {
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [id]: { login, demiurg, name }
        }
      };

      return nextState;
    }

    case PLAYER_LOGOUT: {
      const nextPlayers = { ...state.players };
      delete nextPlayers[id];
      const nextState = {
        ...state,
        players: nextPlayers
      };

      return nextState;
    }

    case ADMIN_LOGOUT: {
      const nextAdmins = { ...state.admins };
      delete nextAdmins[id];
      const nextState = {
        ...state,
        admins: nextAdmins
      };

      return nextState;
    }

    default:
      return state;
  }
};
