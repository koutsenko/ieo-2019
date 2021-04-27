import { TOGGLE_AUTHORIZED } from "common/constants/actions";
import { AUTH_UNKNOWN } from "common/constants/states/auth";

const defaultState = {
  status: AUTH_UNKNOWN,
  login: undefined
};

const auth = (state = defaultState, action) => {
  const { type, status, login } = action;

  switch (type) {
    case TOGGLE_AUTHORIZED: {
      const nextState = { status, login };

      return nextState;
    }

    default:
      return state;
  }
};

export default auth;
