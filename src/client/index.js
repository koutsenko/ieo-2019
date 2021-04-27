import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import App from "./App";
import buildRootMiddleware from "common/middlewares";
import autoReactions from "./middlewares/autoReactions";
import rootReducer from "./reducers";
import * as serviceWorker from "./serviceWorker";
import settings from "server/settings";

import "common/index.css";

const base = "/game";
const host = window.location.hostname;
const port = settings.WS_API_PORT;
const url = `ws://${host}:${port}${base}`;
const store = createStore(rootReducer, buildRootMiddleware([autoReactions]));
const tokenName = "player-token";

const main = () => {
  ReactDOM.render(
    <Provider store={store}>
      <CookiesProvider>
        <App {...{ tokenName, url }} />
      </CookiesProvider>
    </Provider>,
    document.getElementById("root")
  );

  window.store = store;

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister();
};

export default main;
