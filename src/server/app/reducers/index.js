// import libs
import { combineReducers } from "redux";

// import reducers
import accounts from "./accounts";
import auth from "./auth";
import game from "./game";
import gapi from "./gapi";
import results from "./results";
import scenario from "./scenario";
import socketpool from "./socketpool";
import system from "./system";
import tokens from "./tokens";

// export root reducer
export default combineReducers({
  accounts,
  auth,
  game,
  gapi,
  results,
  scenario,
  socketpool,
  system,
  tokens
});
