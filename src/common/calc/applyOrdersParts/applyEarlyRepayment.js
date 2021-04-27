import * as R from "ramda";

import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";
import buildCredit from "common/calc/buildCredit";

const applyEarlyRepayments = (acc, cur) => {
  const { liabilities } = acc;
  const { financialPropertyId, sum } = cur;
  const index = liabilities.findIndex(
    l => l.financialPropertyId === financialPropertyId
  );
  const credit = liabilities[index];
  const { id, principal_remaining } = credit;
  const newSum = principal_remaining - sum;

  // Полное погашение или частичное?
  if (newSum < 1) {
    // Хак #0 - закрываем нахрен кредит, если остался бакс или меньше.
    acc.liabilities = R.remove(index, 1, acc.liabilities);
  } else {
    const { percent, years_remaining } = credit;
    const newCredit = buildCredit(
      id,
      "credit",
      newSum,
      years_remaining,
      percent,
      financialPropertyId
    );

    acc.liabilities = R.adjust(index, () => newCredit, acc.liabilities);
  }

  acc.money = toBucks(toCents(acc.money) - toCents(sum));

  return acc;
};

export default applyEarlyRepayments;
