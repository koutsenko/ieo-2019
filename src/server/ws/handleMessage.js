import handleDoExportLog from "server/app/api-server/handleDoExportLog";
import handleDoGameEnd from "server/app/api-server/handleDoGameEnd";
import handleDoGameJoin from "server/app/api-server/handleDoGameJoin";
import handleDoGameStart from "server/app/api-server/handleDoGameStart";
import handleDoGameStop from "server/app/api-server/handleDoGameStop";
import handleDoJumpPeriod from "server/app/api-server/handleDoJumpPeriod";
import handleDoLoginAdmin from "server/app/api-server/handleDoLoginAdmin";
import handleDoLoginAdminByToken from "server/app/api-server/handleDoLoginAdminByToken";
import handleDoLoginPlayer from "server/app/api-server/handleDoLoginPlayer";
import handleDoLoginPlayerByToken from "server/app/api-server/handleDoLoginPlayerByToken";
import handleDoLogoutAdmin from "server/app/api-server/handleDoLogoutAdmin";
import handleDoLogoutPlayer from "server/app/api-server/handleDoLogoutPlayer";
import handleDoOrder from "server/app/api-server/handleDoOrder";
import handleDoPlayAgain from "server/app/api-server/handleDoPlayAgain";
import handleDoRevertOrders from "server/app/api-server/handleDoRevertOrders";
import handleDoRevertTurn from "server/app/api-server/handleDoRevertTurn";
import handleDoScenarioImport from "server/app/api-server/handleDoScenarioImport";
import handleDoScenarioLiveReload from "server/app/api-server/handleDoScenarioLiveReload";
import handleDoTurn from "server/app/api-server/handleDoTurn";
import handleGetAccountsList from "server/app/api-server/handleGetAccountsList";
import handleGetGameState from "server/app/api-server/handleGetGameState";
import handleGetScenario from "server/app/api-server/handleGetScenario";

import {
  DO_EXPORT_LOG,
  DO_GAME_END,
  DO_GAME_JOIN,
  DO_GAME_START,
  DO_GAME_STOP,
  DO_JUMP_PERIOD,
  DO_LOGIN,
  DO_LOGIN_BY_TOKEN,
  DO_LOGOUT,
  DO_ORDER,
  DO_PLAY_AGAIN,
  DO_REVERT_ORDERS,
  DO_REVERT_TURN,
  DO_SCENARIO_IMPORT,
  DO_SCENARIO_LIVE_RELOAD,
  DO_TURN,
  GET_ACCOUNTS_LIST,
  GET_GAME_STATE,
  GET_SCENARIO
} from "common/constants/api";

import { AUTH_ADMIN, AUTH_PLAYER } from "server/app/constants/states";

const errorResponse = {
  success: false,
  reason: "unknown command type"
};

const unauthorizedResponse = {
  success: false,
  reason: "unauthorized"
};

export default (endpoint, socketId, ws, store) => async raw => {
  const state = store.getState();

  let key;
  let response;

  try {
    const message = JSON.parse(raw);
    const { type, data } = message;
    const requiredAccess = {
      admin: AUTH_ADMIN,
      player: AUTH_PLAYER
    }[endpoint];

    key = message.key;

    // check auth (only DO_LOGIN_* allowed for unauthorized)
    if (
      ![DO_LOGIN, DO_LOGIN_BY_TOKEN].includes(type) &&
      state.auth[socketId].status !== requiredAccess
    ) {
      console.log("unauthorized message", raw);
      response = unauthorizedResponse;
    } else {
      // common admin/player requests with same handlers
      if (type === GET_GAME_STATE) {
        response = handleGetGameState(store)();
      } else {
        // common admin/player requests with different handlers
        if (type === DO_LOGIN) {
          if (endpoint === "admin") {
            response = handleDoLoginAdmin(store)(socketId, data);
          } else if (endpoint === "player") {
            response = handleDoLoginPlayer(store)(socketId, data);
          }
        } else if (type === DO_LOGIN_BY_TOKEN) {
          if (endpoint === "admin") {
            response = handleDoLoginAdminByToken(store)(socketId, data);
          } else if (endpoint === "player") {
            response = handleDoLoginPlayerByToken(store)(socketId, data);
          }
        } else if (type === DO_LOGOUT) {
          if (endpoint === "admin") {
            response = handleDoLogoutAdmin(store)(socketId);
          } else if (endpoint === "player") {
            response = handleDoLogoutPlayer(store)(socketId);
          }
        } else {
          // individual admin or player requests
          if (endpoint === "admin") {
            if (type === DO_GAME_END) {
              response = await handleDoGameEnd(store)();
            } else if (type === DO_GAME_START) {
              response = handleDoGameStart(store)();
            } else if (type === DO_GAME_STOP) {
              response = handleDoGameStop(store)();
            } else if (type === DO_REVERT_TURN) {
              response = await handleDoRevertTurn(store)(data);
            } else if (type === DO_SCENARIO_IMPORT) {
              response = await handleDoScenarioImport(store)();
            } else if (type === GET_ACCOUNTS_LIST) {
              response = handleGetAccountsList(store)();
            } else if (type === GET_SCENARIO) {
              response = handleGetScenario(store)();
            } else if (type === DO_EXPORT_LOG) {
              response = await handleDoExportLog(store)(data);
            }
          } else if (endpoint === "player") {
            if (type === DO_GAME_JOIN) {
              response = handleDoGameJoin(store)(socketId);
            } else if (type === DO_TURN) {
              response = handleDoTurn(store)(socketId, data);
            } else if (type === DO_ORDER) {
              response = handleDoOrder(store)(socketId, data);
            } else if (type === DO_REVERT_ORDERS) {
              response = handleDoRevertOrders(store)(socketId);
            } else if (type === DO_PLAY_AGAIN) {
              response = handleDoPlayAgain(store)(socketId);
            } else if (state.auth[socketId].demiurg) {
              // demiurg-player commands
              if (type === DO_SCENARIO_LIVE_RELOAD) {
                response = await handleDoScenarioLiveReload(store)(socketId);
              } else if (type === DO_JUMP_PERIOD) {
                response = handleDoJumpPeriod(store)(socketId, data);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    response = {
      success: false,
      reason: "Fatal error, contact the administrators"
    };
  }

  // handler not found - unknown request
  if (!response) {
    console.log("unhandled message", raw);
    response = errorResponse;
  }

  const answer = JSON.stringify({ ...response, key });
  ws.send(answer);
};
