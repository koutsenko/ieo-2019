import * as R from "ramda";

import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";

export default (turnState, forced) => {
  const { currentLeverageCreditCost, liabilities, reservedFunds } = turnState;
  const lc_index = liabilities.findIndex(l => l.type === "leverage_credit");
  const rfi = reservedFunds.findIndex(i => i.type === "leverage_payment");

  let result = { ...turnState };

  if (lc_index === -1) {
    if (reservedFunds[rfi].value !== 0) {
      result.reservedFunds = R.adjust(
        rfi,
        rf => ({
          ...rf,
          value: 0
        }),
        result.reservedFunds
      );
    }

    return result;
  }

  const lc = liabilities[lc_index];
  const { principal } = lc;
  const charge = toBucks(
    toCents((principal * currentLeverageCreditCost) / 100)
  );

  result = {
    ...result,
    reservedFunds: R.adjust(
      rfi,
      rf => ({
        ...rf,
        value: charge
      }),
      result.reservedFunds
    )
  };

  result.money = toBucks(toCents(result.money) - toCents(charge));
  if (result.money < 0 && forced) {
    result.endByBankruptcy = true;
  }

  return result;
};
