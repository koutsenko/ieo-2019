import {
  REFRESH_GAME_STATE,
  REVERT_STORE_TO_LOGIN
} from "common/constants/actions";
import { REFRESH_SCENARIO } from "admin/constants/actions";

const defaultState = {
  gameState: undefined,
  scenario: undefined
};

const server = (state = defaultState, action) => {
  const { type, gameState, scenario } = action;

  switch (type) {
    case REVERT_STORE_TO_LOGIN:
      return defaultState;

    case REFRESH_GAME_STATE: {
      const nextState = {
        ...state,
        gameState
      };

      return nextState;
    }

    case REFRESH_SCENARIO: {
      const nextState = {
        ...state,
        scenario
      };

      return nextState;
    }

    default:
      return state;
  }
};

export default server;
