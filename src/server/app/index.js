/******************************************************************************/
import { createISOnow } from "common/utils/dates";
/******************************************************************************/

import settings from "server/settings";

// import libs
import h from "http";
import { Server } from "ws";
import { createStore } from "redux";

// helpers
import { now } from "common/utils/dates";
import { getIP } from "common/utils/net";

// import network event handlers
import handleHttpRequest from "server/http";
import handleHttpUpgrade from "server/ws/handleHttpUpgrade";
import handleAdminSocket from "server/ws/handleAdminSocket";
import handlePlayerSocket from "server/ws/handlePlayerSocket";

// import store parts
import rootReducer from "server/app/reducers";
import rootMiddleware from "server/app/middlewares";

// import google sheets helpers
import getAPI from "server/app/api-sheets/getAPI";
import queryAccounts from "server/app/api-sheets/queries/accounts";
import queryScenario from "server/app/api-sheets/queries/scenario";

// import redux actions
import driveApiInit from "server/app/actions/driveApiInit";
import sheetsApiInit from "server/app/actions/sheetsApiInit";
import accountsFileId from "server/app/actions/accountsFileId";
import accountsLoaded from "server/app/actions/accountsLoaded";
import scenarioFileId from "server/app/actions/scenarioFileId";
import scenarioLoaded from "server/app/actions/scenarioLoaded";
import resultsFileId from "server/app/actions/resultsFileId";
import gameStarted from "server/app/actions/gameStart";
import { REMOVE_FIRST_RESULT } from "./constants/actions";
import writeResult from "./api-sheets/writeResult";

/******************************************************************************/

// create redux store
const store = createStore(rootReducer, rootMiddleware);

/******************************************************************************/

// prepare: init sheets api, check spreadsheets sheets names, read accounts list
const prepare = async () => {
  let apis;
  let sheets_api;
  let drive_api;
  let accounts;
  let scenarioData;
  // let tableNames;

  try {
    apis = await getAPI();
    sheets_api = apis.sheets;
    drive_api = apis.drive;
  } catch (error) {
    throw new Error(`getAPI error: ${error}`);
  }

  store.dispatch(sheetsApiInit(sheets_api));
  store.dispatch(driveApiInit(drive_api));

  // test: try to read files and their ids.
  let files;
  try {
    const options = {
      pageSize: 100,
      fields: "nextPageToken, files(id, name, modifiedTime)"
    };
    const res = await drive_api.files.list(options);
    files = res.data.files;
  } catch (error) {
    throw new Error(`file list error: api failed: ${error}`);
  }

  if (!files.length) {
    throw new Error(`file list error: no files found`);
  }

  const accountsFile = files.find(f => f.name === "accounts");
  const resultsFile = files.find(f => f.name === "results");
  const scenarioFile = files.find(f => f.name === "scenario");

  if (accountsFile === undefined) {
    throw new Error(`file list error: no accounts file found`);
  }
  store.dispatch(accountsFileId(accountsFile.id));

  if (resultsFile === undefined) {
    throw new Error("file list error: no results file found");
  }
  store.dispatch(resultsFileId(resultsFile.id));

  if (scenarioFile === undefined) {
    throw new Error(`file list error: no scenario file found`);
  }
  store.dispatch(
    scenarioFileId(scenarioFile.id, scenarioFile.modifiedTime, createISOnow())
  );

  try {
    accounts = await queryAccounts(store.getState());
  } catch (error) {
    throw new Error(`queryAccounts error: ${error}`);
  }
  store.dispatch(accountsLoaded(accounts));

  try {
    scenarioData = await queryScenario(store.getState());
  } catch (error) {
    throw new Error(`queryScenario error: ${error}`);
  }
  store.dispatch(scenarioLoaded(scenarioData));

  // automatically start game on loaded scenario!
  // before release comment it line!
  store.dispatch(gameStarted());
};

// main: create network interfaces, attach event listeners and start server
const main = () => {
  const server = h.createServer();
  const serverWS = h.createServer();
  const wssA = new Server({ noServer: true });
  const wssG = new Server({ noServer: true });

  wssA.on("connection", (ws, req) => handleAdminSocket(store, getIP(req))(ws));
  wssG.on("connection", (ws, req) => handlePlayerSocket(store, getIP(req))(ws));

  server.on("request", handleHttpRequest);
  serverWS.on("upgrade", handleHttpUpgrade(wssA, wssG));

  server.listen(settings.HTTP_WEB_PORT, "0.0.0.0", () => {
    console.log(`${now()} Server listen http, port ${settings.HTTP_WEB_PORT}`);
  });
  serverWS.listen(settings.WS_API_PORT, "0.0.0.0", () => {
    console.log(`${now()} Server listen socket, port ${settings.WS_API_PORT}`);
  });

  setInterval(async () => {
    const state = store.getState();
    const { results } = state;

    if (results.length === 0) {
      return;
    }

    const result = results[0];
    try {
      await writeResult(state, result);
      const buffer = results.length - 1;
      console.log(`${now()} Wrote result to google sheets, ${buffer} in queue`);
      store.dispatch({
        type: REMOVE_FIRST_RESULT
      });
    } catch (error) {
      console.log(`${now()} Failed to write result, will try next 2 seconds`);
    }
  }, 2000);
};

/******************************************************************************/

// entry point with error traps
prepare()
  .then(() => {
    try {
      main();
    } catch (error) {
      console.error(`main stage error: ${error}`);
    }
  })
  .catch(error => {
    console.error(`prepare stage error: ${error}`);
  });

/******************************************************************************/
