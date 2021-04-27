import {
  REFRESH_GAME_STATE,
  REVERT_STORE_TO_LOGIN,
  SERVER_NOTIFY
} from "common/constants/actions";
import {
  GAME_STARTED,
  GAME_STOPPED,
  GAME_CHANGED,
  GAME_SUSPENDED,
  GAME_RESUMED
} from "common/constants/notifications";
import {
  GAME_STATE_NOT_RUNNING,
  GAME_STATE_RUNNING,
  GAME_STATE_SUSPENDED
} from "common/constants/states/game";
import { PREPARE_TURN, ENABLE_TRY_PAY_DEBTS } from "client/constants/actions";

const defaultState = {
  gameState: undefined,
  turnState: undefined,
  orderedTurnState: undefined
};

const game = (state = defaultState, action) => {
  const { type, gameState, message, orderedTurnState, turnState } = action;

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

    case ENABLE_TRY_PAY_DEBTS: {
      const nextState = {
        ...state,
        turnState: {
          ...state.turnState,
          negativeBalanceFlag: undefined
        },
        orderedTurnState: {
          ...state.orderedTurnState,
          negativeBalanceFlag: undefined
        }
      };

      return nextState;
    }

    case PREPARE_TURN: {
      const nextState = {
        ...state,
        orderedTurnState,
        turnState
      };

      return nextState;
    }

    case SERVER_NOTIFY: {
      if (message.type === GAME_STARTED) {
        const nextState = {
          ...state,
          gameState: GAME_STATE_RUNNING,
          orderedTurnState: undefined,
          turnState: undefined
        };

        return nextState;
      } else if (message.type === GAME_STOPPED) {
        const nextState = {
          ...state,
          gameState: GAME_STATE_NOT_RUNNING,
          orderedTurnState: undefined,
          turnState: undefined
        };

        return nextState;
      } else if (message.type === GAME_SUSPENDED) {
        const nextState = {
          ...state,
          gameState: GAME_STATE_SUSPENDED
        };

        return nextState;
      } else if (message.type === GAME_RESUMED) {
        const nextState = {
          ...state,
          gameState: GAME_STATE_RUNNING
        };

        return nextState;
      } else if (message.type === GAME_CHANGED) {
        const nextState = {
          ...state,
          orderedTurnState: message.orderedTurnState,
          turnState: message.turnState
        };

        return nextState;
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

export default game;
