import * as R from "ramda";

import {
  GAME_STATE_NOT_RUNNING,
  GAME_STATE_RUNNING
} from "common/constants/states/game";

import {
  PLAYER_JOINED_GAME,
  PLAYER_MADE_ORDER,
  PLAYER_MADE_REVERT_ORDERS,
  PLAYER_MADE_TURN,
  PLAYER_RESET,
  PLAYER_REVERT_ONE_TURN,
  PLAYER_SLICE_TURNS,
  TOGGLE_GAME_START,
  TOGGLE_GAME_STOP
} from "server/app/constants/actions";

const defaultState = {
  status: GAME_STATE_NOT_RUNNING,
  players: {}
};

export default (state = defaultState, action) => {
  const { type, login, turnState, order, start, end, dropOrders } = action;

  switch (type) {
    case PLAYER_REVERT_ONE_TURN: {
      let revertedTurnStates = R.init(state.players[login].turnStates);
      if (dropOrders) {
        revertedTurnStates = R.adjust(
          revertedTurnStates.length - 1,
          ts => ({ ...ts, orders: [] }),
          revertedTurnStates
        );
      }
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [login]: {
            turnStates: revertedTurnStates
          }
        }
      };
      return nextState;
    }

    case TOGGLE_GAME_START: {
      const nextState = {
        ...state,
        status: GAME_STATE_RUNNING,
        players: {}
      };

      return nextState;
    }

    case TOGGLE_GAME_STOP: {
      const nextState = {
        ...state,
        status: GAME_STATE_NOT_RUNNING,
        players: {}
      };

      return nextState;
    }

    case PLAYER_JOINED_GAME:
    case PLAYER_RESET: {
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [login]: {
            turnStates: [turnState]
          }
        }
      };

      return nextState;
    }

    case PLAYER_MADE_ORDER: {
      const ts = state.players[login].turnStates;
      const nextTurnState = {
        ...ts[ts.length - 1],
        orders: [...ts[ts.length - 1].orders, order]
      };
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [login]: {
            turnStates: Object.assign([...ts], {
              [ts.length - 1]: nextTurnState
            })
          }
        }
      };

      return nextState;
    }

    case PLAYER_MADE_REVERT_ORDERS: {
      const ts = state.players[login].turnStates;
      const nextTurnState = {
        ...ts[ts.length - 1],
        orders: []
      };
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [login]: {
            turnStates: Object.assign([...ts], {
              [ts.length - 1]: nextTurnState
            })
          }
        }
      };

      return nextState;
    }

    case PLAYER_MADE_TURN: {
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [login]: {
            ...state.players[login],
            turnStates: [...state.players[login].turnStates, turnState]
          }
        }
      };

      return nextState;
    }

    case PLAYER_SLICE_TURNS: {
      const nextState = {
        ...state,
        players: {
          ...state.players,
          [login]: {
            ...state.players[login],
            turnStates: state.players[login].turnStates.slice(start, end)
          }
        }
      };

      return nextState;
    }

    default:
      return state;
  }
};
