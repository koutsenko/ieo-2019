import {
  TOGGLE_EVENTS_COLLAPSED,
  TOGGLE_DEMIURG_COLLAPSED,
  TOGGLE_LEVERAGE
} from "client/constants/actions";

const defaultState = {
  eventsCollapsed: false,
  demiurgCollapsed: true,
  leverage: false
};

const uiclient = (state = defaultState, action) => {
  const { type, demiurgCollapsed, eventsCollapsed, leverage } = action;

  switch (type) {
    case TOGGLE_LEVERAGE:
      return {
        ...state,
        leverage
      };

    case TOGGLE_EVENTS_COLLAPSED:
      return {
        ...state,
        eventsCollapsed
      };

    case TOGGLE_DEMIURG_COLLAPSED:
      return {
        ...state,
        demiurgCollapsed
      };

    default:
      return state;
  }
};

export default uiclient;
