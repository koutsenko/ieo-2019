import * as R from "ramda";

import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";
import getTodayInstrument from "common/selectors/todayInstrument";
import generateNextFinancialPropertyId from "common/selectors/nextFinancialPropertyId";
import buildCredit from "common/calc/buildCredit";

const applyTakeCredit = (acc, cur) => {
  const { id, years, sum } = cur;
  let key;
  if (years >= 1 && years <= 3) {
    key = "1-3 years";
  } else if (years >= 4 && years <= 7) {
    key = "4-7 years";
  } else if (years) {
    key = "8-12 years";
  }

  const instrument = getTodayInstrument(acc, id);
  const percent = instrument[key];
  const credit = buildCredit(
    id,
    "credit",
    sum,
    years,
    percent,
    generateNextFinancialPropertyId(acc.liabilities, id)
  );

  acc.money = toBucks(toCents(acc.money) + toCents(sum));
  acc.liabilities = R.append(credit, acc.liabilities);

  return acc;
};

export default applyTakeCredit;
