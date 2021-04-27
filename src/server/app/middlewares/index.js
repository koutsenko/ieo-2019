// import libs
import { applyMiddleware } from "redux";

// import middlewares
import thunk from "redux-thunk";
import logger from "./logger";

// export root middleware
export default applyMiddleware(thunk, logger);
