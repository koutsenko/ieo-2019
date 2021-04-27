import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import ReduxThunk from "redux-thunk";

import sender from "./sender";

const buildRootMiddleware = addons => {
  const custom = Array.isArray(addons) ? addons : [];
  const logger = createLogger({ collapsed: true });
  const middlewares = [ReduxThunk, ...custom, sender, logger];

  return composeWithDevTools(applyMiddleware(...middlewares));
};

export default buildRootMiddleware;
