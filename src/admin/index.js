import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import settings from "server/settings";

import App from "./App";
import buildRootMiddleware from "common/middlewares";
import rootReducer from "admin/reducers";
import * as serviceWorker from "./serviceWorker";

import "common/index.css";
// import "./index.module.css";
// import { SET_FONT } from "common/constants/actions";

const base = "/admin";
const host = window.location.hostname;
const port = settings.WS_API_PORT;
const url = `ws://${host}:${port}${base}`;
const store = createStore(rootReducer, buildRootMiddleware());
const tokenName = "admin-token";

// store.dispatch({
//   type: SET_FONT,
//   font: {
//     fontFamily: "Cousine",
//     fontSize: "14px",
//     fontSpacing: "0px",
//     fontWeight: "bold"
//   }
// });

const main = () => {
  ReactDOM.render(
    <Provider store={store}>
      <CookiesProvider>
        <App {...{ tokenName, url }} />
      </CookiesProvider>
    </Provider>,
    document.getElementById("root")
  );

  // debug
  window.store = store;

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister();
};

export default main;
