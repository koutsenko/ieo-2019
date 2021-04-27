import { combineReducers } from "redux";

import { RESET_STORE } from "common/constants/actions";
import auth from "common/reducers/auth";
import net from "common/reducers/socket";
import server from "admin/reducers/server";
import ui from "common/reducers/ui";

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }

  return combineReducers({ auth, net, server, ui })(state, action);
};

export default rootReducer;
