import {
  SOCKET_ACTION_IDLE,
  SOCKET_STATUS_CLOSED
} from "common/constants/states/socket";

import {
  FINISH_REQUEST,
  CREATE_SOCKET,
  TOGGLE_SOCKET_ACTION,
  TOGGLE_SOCKET_STATUS,
  WAIT_FOR_REQUEST
} from "common/constants/actions";

const defaultState = {
  action: SOCKET_ACTION_IDLE,
  status: SOCKET_STATUS_CLOSED,
  reqs: {},
  ws: null,
  url: null
};

const net = (state = defaultState, dispatchedAction) => {
  const {
    type,
    action,
    status,
    ws,
    key,
    resolve,
    reject,
    url
  } = dispatchedAction;

  switch (type) {
    case FINISH_REQUEST: {
      const reqs = { ...state.reqs };
      delete reqs[key];

      return {
        ...state,
        reqs
      };
    }

    case WAIT_FOR_REQUEST: {
      return {
        ...state,
        reqs: {
          ...state.reqs,
          [key]: { resolve, reject }
        }
      };
    }

    case CREATE_SOCKET: {
      return {
        ...state,
        ws,
        url
      };
    }

    case TOGGLE_SOCKET_ACTION: {
      return {
        ...state,
        action
      };
    }

    case TOGGLE_SOCKET_STATUS: {
      return {
        ...state,
        status
      };
    }

    default:
      return state;
  }
};

export default net;
