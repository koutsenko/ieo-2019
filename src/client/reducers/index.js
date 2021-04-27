import { combineReducers } from "redux";

import { RESET_STORE } from "common/constants/actions";
import auth from "common/reducers/auth";
import net from "common/reducers/socket";
import ui from "common/reducers/ui";
import game from "./game";
import uiclient from "./uiclient";

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }

  return combineReducers({ auth, game, net, ui, uiclient })(state, action);
};

export default rootReducer;
