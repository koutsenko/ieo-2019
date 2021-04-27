import * as R from "ramda";

import { now } from "common/utils/dates";
import {
  ACCOUNTS_FILE_ID,
  ACCOUNTS_LOADED,
  ADMIN_LOGOUT,
  AUTHENTICATED_ADMIN,
  AUTHENTICATED_PLAYER,
  DRIVE_API_INIT,
  PLAYER_JOINED_GAME,
  PLAYER_MADE_ORDER,
  PLAYER_MADE_REVERT_ORDERS,
  PLAYER_MADE_TURN,
  PLAYER_RESET,
  REMOVE_FIRST_RESULT,
  RESULTS_FILE_ID,
  SCENARIO_FILE_ID,
  SCENARIO_LOADED,
  SHEETS_API_INIT,
  SOCKET_ADMIN_CONNECTED,
  SOCKET_ADMIN_DISCONNECTED,
  SOCKET_PLAYER_CONNECTED,
  SOCKET_PLAYER_DISCONNECTED,
  STORE_RESULT,
  TOGGLE_GAME_START
} from "server/app/constants/actions";

const REDUX_ACTIONS_BLACKLIST = [
  ACCOUNTS_FILE_ID,
  ADMIN_LOGOUT,
  DRIVE_API_INIT,
  REMOVE_FIRST_RESULT,
  RESULTS_FILE_ID,
  SCENARIO_FILE_ID,
  SHEETS_API_INIT,
  SOCKET_ADMIN_CONNECTED,
  SOCKET_PLAYER_CONNECTED,
  STORE_RESULT
];

/**
 * Строково представление ордера.
 * Желательно такое, чтобы можно было закодировать обратно.
 */
const decodeOrder = (state, data) => {
  const { login } = data;
  const ts = R.last(state.game.players[login].turnStates);
  const { turn } = ts;
  const dataStr = JSON.stringify(data.order);
  const result = `in turn ${turn} made an order: ${dataStr}`;

  return result;
};

const wrap = text => `${now()} ${text}`;

const format = (state, action) => {
  const { login, turnState, type } = action;

  let message;

  if (type === ACCOUNTS_LOADED) {
    message = `Accounts loaded from Google sheets, ${action.accounts.length} entries`;
  } else if (type === AUTHENTICATED_ADMIN) {
    message = `Admin [${login}] (${action.name}) logged from ${state.auth[action.id].ip}`;
  } else if (type === AUTHENTICATED_PLAYER) {
    message = `Player [${login}] (${action.name}) logged from ${state.auth[action.id].ip}`;
  } else if (type === PLAYER_JOINED_GAME) {
    message = `Player [${login}] joined game`;
  } else if (type === PLAYER_MADE_ORDER) {
    const order = decodeOrder(state, action);
    message = `Player [${login}] ${order}`;
  } else if (type === PLAYER_MADE_REVERT_ORDERS) {
    const { turn } = R.last(state.game.players[login].turnStates);
    message = `Player [${login}] in turn ${turn} revert back all orders`;
  } else if (type === PLAYER_MADE_TURN) {
    const t = turnState.turn;
    const p = turnState.turn - 1;
    if (turnState.endByBankruptcy) {
      message = `Player [${login}] ended turn ${p} and was bankrupt`;
    } else if (turnState.endByPension) {
      message = `Player [${login}] ended turn ${p} and goes to pension`;
    } else if (turnState.endByWin) {
      message = `Player [${login}] ended turn ${p} and wins the game`;
    } else {
      message = `Player [${login}] made turn ${p}->${t}`;
    }
  } else if (type === PLAYER_RESET) {
    const { turn } = R.last(state.game.players[login].turnStates);
    message = `Player [${login}] started new game after end in turn ${turn}`;
  } else if (type === SCENARIO_LOADED) {
    const scenario_name = action.scenarioData.globalParams["scenario name"];
    message = `Scenario loaded from Google sheets, name "${scenario_name}"`;
  } else if (type === SOCKET_ADMIN_DISCONNECTED) {
    const token = state.tokens.admins[action.id];
    const l = token ? token.login : "not logged";
    message = `Admin [${l}] disconnected`;
  } else if (type === SOCKET_PLAYER_DISCONNECTED) {
    const token = state.tokens.players[action.id];
    const l = token ? token.login : "not logged";
    message = `Player [${l}] disconnected`;
  } else if (type === TOGGLE_GAME_START) {
    message = "Game status changed to GAME_STATE_RUNNING";
  } else {
    message = `(!) Unrecognized action type ${type}`;
  }

  return wrap(message);
};

export default store => next => action => {
  const { type } = action;
  const state = store.getState();

  if (!REDUX_ACTIONS_BLACKLIST.includes(type)) {
    console.log(format(state, action));
  } else {
    let dummy = true;
  }

  return next(action);
};
