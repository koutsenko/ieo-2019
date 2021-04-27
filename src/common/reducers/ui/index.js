import {
  HIDE_SNACKBAR,
  REVERT_STORE_TO_LOGIN,
  SET_FONT,
  SHOW_SNACKBAR
} from "common/constants/actions";

const defaultState = {
  snackbar: null,
  font: {
    fontFamily: "Roboto Mono",
    fontSpacing: "-1px",
    fontWeight: "300",
    fontSize: "14px"
  }
};

const ui = (state = defaultState, action) => {
  const { type, success, message, font } = action;

  switch (type) {
    case REVERT_STORE_TO_LOGIN:
      return defaultState;

    case SET_FONT:
      return {
        ...state,
        font
      };

    case SHOW_SNACKBAR:
      return {
        ...state,
        snackbar: {
          success,
          message
        }
      };

    case HIDE_SNACKBAR:
      return {
        ...state,
        snackbar: null
      };

    default:
      return state;
  }
};

export default ui;
