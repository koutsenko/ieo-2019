import processLife from "./processChargesParts/processLife";
import processRent from "./processChargesParts/processRent";
import processLeverageCredit from "./processChargesParts/processLeverageCredit";
import processCredits from "./processChargesParts/processCredits";

export default (turnState, forced) => {
  let nextTurnState = {
    ...turnState
  };

  nextTurnState = processLife(nextTurnState, forced);
  nextTurnState = processRent(nextTurnState, forced);
  nextTurnState = processLeverageCredit(nextTurnState, forced);
  nextTurnState = processCredits(nextTurnState, forced);

  return nextTurnState;
};
