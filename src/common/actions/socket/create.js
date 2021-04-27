import finishRequest from "common/actions/socket/flush";
import notifyHandler from "common/actions/socket/notifyHandler";
import toggleSocketStatus from "common/actions/socket/status";
import req from "common/actions/socket/req";
import toggleAuthorized from "common/actions/auth/toggleAuthorized";
import { CREATE_SOCKET } from "common/constants/actions";
import {
  SOCKET_STATUS_CLOSED,
  SOCKET_STATUS_OPEN,
  SOCKET_STATUS_ERROR
} from "common/constants/states/socket";
import history from "common/utils/history";
import doLoginByToken from "common/api/doLoginByToken";
import {
  AUTH_AUTHORIZED,
  AUTH_UNAUTHORIZED
} from "common/constants/states/auth";

const createSocket = (url, cookies, tokenName) => (dispatch, getState) => {
  const ws = new WebSocket(url);

  ws.onerror = () => dispatch(toggleSocketStatus(SOCKET_STATUS_ERROR));
  ws.onopen = async () => {
    dispatch(toggleSocketStatus(SOCKET_STATUS_OPEN));

    const token = cookies.get(tokenName);
    if (token) {
      try {
        const login = await req(doLoginByToken(token))(dispatch, getState);
        dispatch(toggleAuthorized(AUTH_AUTHORIZED, login));
      } catch (error) {
        cookies.remove(tokenName);
        dispatch(toggleAuthorized(AUTH_UNAUTHORIZED));
      }
    } else {
      dispatch(toggleAuthorized(AUTH_UNAUTHORIZED));
    }
  };
  ws.onclose = () => dispatch(toggleSocketStatus(SOCKET_STATUS_CLOSED));
  ws.onmessage = event => {
    const state = getState();
    const { reqs } = state.net;
    const raw = event.data;
    const parsed = JSON.parse(raw);
    const { key, success, data, reason } = parsed;

    if (key !== undefined) {
      if (success) {
        reqs[key].resolve(data);
      } else {
        reqs[key].reject(reason);
        if (reason === "unauthorized") {
          history.push("/login");
        }
      }

      dispatch(finishRequest(key));
    } else {
      dispatch(notifyHandler(parsed));
    }
  };

  dispatch({
    type: CREATE_SOCKET,
    ws,
    url
  });
};

export default createSocket;
