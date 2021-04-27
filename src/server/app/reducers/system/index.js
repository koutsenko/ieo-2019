import {
  ACCOUNTS_FILE_ID,
  RESULTS_FILE_ID,
  SCENARIO_FILE_ID
} from "server/app/constants/actions";

const defaultState = {
  accounts_file_id: undefined,
  results_file_id: undefined,
  scenario_file_id: undefined,
  scenario_file_loaded: undefined,
  scenario_file_lastmod: undefined
};

export default (state = defaultState, action) => {
  const {
    type,
    accounts_file_id,
    results_file_id,
    scenario_file_id,
    scenario_file_lastmod,
    scenario_file_loaded
  } = action;

  switch (type) {
    case ACCOUNTS_FILE_ID: {
      const nextState = {
        ...state,
        accounts_file_id
      };

      return nextState;
    }

    case RESULTS_FILE_ID: {
      const nextState = {
        ...state,
        results_file_id
      };

      return nextState;
    }

    case SCENARIO_FILE_ID: {
      const nextState = {
        ...state,
        scenario_file_id,
        scenario_file_lastmod,
        scenario_file_loaded
      };

      return nextState;
    }

    default:
      return state;
  }
};
