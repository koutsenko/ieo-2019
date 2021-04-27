import applyOrders from "common/calc/applyOrders";
import checkGameEnd from "server/app/utils/checkGameEnd";
import payDividends from "server/app/utils/payDividends";
import payIncome from "server/app/utils/payIncome";
import processCharges from "server/app/utils/processCharges";
import processClosedCredits from "server/app/utils/processClosedCredits";
import processExpiredBonds from "server/app/utils/processExpiredBonds";
import processMarginCall from "server/app/utils/processMarginCall";
import processReservedCapital from "server/app/utils/processReservedCapital";
import updateIncome from "server/app/utils/updateIncome";
import updateLeverageAndMortgage from "server/app/utils/updateLeverageAndMortgage";
import updateLifeCost from "server/app/utils/updateLifeCost";
import updateRent from "server/app/utils/updateRent";
import updateReDecay from "server/app/utils/updateReDecay";
import updateTaxRate from "server/app/utils/updateTaxRate";
import generateResult from "server/app/utils/generateResult";
import storeResult from "server/app/utils/storeResult";
import { now } from "common/utils/dates";

export default (lastTurnState, store, forced) => {
  const state = store.getState();

  let nextTurnState = {
    ...applyOrders(lastTurnState),
    turn: lastTurnState.turn + 1
  };

  nextTurnState = updateReDecay(nextTurnState, state);
  nextTurnState = updateRent(nextTurnState, state);
  nextTurnState = updateTaxRate(nextTurnState, state);
  nextTurnState = updateLeverageAndMortgage(nextTurnState, state);
  nextTurnState = updateIncome(nextTurnState, state);
  nextTurnState = updateLifeCost(nextTurnState, state); // after updateIncome, couz it based on current income
  nextTurnState = payIncome(nextTurnState);
  nextTurnState = payDividends(nextTurnState);
  nextTurnState = processClosedCredits(nextTurnState);
  nextTurnState = processExpiredBonds(nextTurnState);
  nextTurnState = processCharges(nextTurnState, forced);
  nextTurnState = processReservedCapital(nextTurnState); // just update rc again, after all changes
  if (!nextTurnState.endByBankruptcy) {
    nextTurnState = processMarginCall(nextTurnState); // no mc if already bankrupt
  }
  nextTurnState = checkGameEnd(nextTurnState);

  if (
    nextTurnState.endByBankruptcy ||
    nextTurnState.endByPension ||
    nextTurnState.endByWin
  ) {
    // FIXME Научить его флушить результаты если что (шатдаун, релоад сценария и т.п.)
    const result = generateResult(state, nextTurnState);
    console.log(`${now()} RESULT: ${result.join(";")}`);
    store.dispatch(storeResult(result));
  }

  return nextTurnState;
};
