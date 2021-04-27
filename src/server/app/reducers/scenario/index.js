import { SCENARIO_LOADED } from "server/app/constants/actions";

const defaultState = {
  coeffs: {
    coeffIncome: undefined,
    coeffLifeCost: undefined,
    coeffRent: undefined,
    events: {
      globalEvents: undefined,
      playerEvents: undefined
    },
    globalParams: undefined,
    instruments: {
      meta: undefined,
      history: undefined,
      names: undefined
    },
    taxrates: undefined,
    mortgageLoanCosts: undefined,
    leverageCreditCosts: undefined
  }
};

export default (state = defaultState, action) => {
  const { type, scenarioData } = action;

  switch (type) {
    case SCENARIO_LOADED: {
      const {
        coeffIncome,
        coeffLifeCost,
        coeffRent,
        globalEvents,
        globalParams,
        playerEvents,
        meta,
        history,
        names,
        taxrates,
        mortgageLoanCosts,
        leverageCreditCosts
      } = scenarioData;
      const nextState = {
        coeffs: {
          coeffIncome,
          coeffLifeCost,
          coeffRent
        },
        events: {
          globalEvents,
          playerEvents
        },
        globalParams,
        instruments: {
          history,
          meta,
          names
        },
        taxrates,
        mortgageLoanCosts,
        leverageCreditCosts
      };
      return nextState;
    }

    default:
      return state;
  }
};
