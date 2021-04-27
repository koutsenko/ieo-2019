import * as R from "ramda";

import {
  STORE_RESULT,
  REMOVE_FIRST_RESULT
} from "server/app/constants/actions";

const defaultState = [];

export default (state = defaultState, action) => {
  const { type, result } = action;

  switch (type) {
    case STORE_RESULT: {
      const nextState = [...state, result];

      return nextState;
    }

    case REMOVE_FIRST_RESULT: {
      const nextState = R.remove(0, 1, state);

      return nextState;
    }

    default:
      return state;
  }
};
