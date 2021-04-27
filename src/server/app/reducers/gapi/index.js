import { DRIVE_API_INIT, SHEETS_API_INIT } from "server/app/constants/actions";

const defaultState = {
  drive_api: undefined,
  sheets_api: undefined
};

export default (state = defaultState, action) => {
  const { type, drive_api, sheets_api } = action;

  switch (type) {
    case DRIVE_API_INIT: {
      const nextState = {
        ...state,
        drive_api
      };

      return nextState;
    }

    case SHEETS_API_INIT: {
      const nextState = {
        ...state,
        sheets_api
      };

      return nextState;
    }

    default:
      return state;
  }
};
