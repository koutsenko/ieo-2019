import * as R from "ramda";

import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";

const applyPayLeverage = (acc, cur) => {
  const { liabilities } = acc;
  const lc_index = liabilities.findIndex(l => l.type === "leverage_credit");
  const lc = liabilities[lc_index];
  const { principal } = lc;

  acc.money = toBucks(toCents(acc.money) - toCents(principal));
  acc.liabilities = R.remove(lc_index, 1, acc.liabilities);

  return acc;
};

export default applyPayLeverage;
