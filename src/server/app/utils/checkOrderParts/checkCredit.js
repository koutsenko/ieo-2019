import buildCredit from "common/calc/buildCredit";
import getFreeIncome from "common/calc/getFreeIncome";
import generateNextFinancialPropertyId from "common/selectors/nextFinancialPropertyId";
import getTodayInstrument from "common/selectors/todayInstrument";

const checkCredit = (instruments, orderedTurnState, orderData) => {
  let result = { success: true };
  let { id, years, sum } = orderData;
  let key;
  if (years >= 1 && years <= 3) {
    key = "1-3 years";
  } else if (years >= 4 && years <= 7) {
    key = "4-7 years";
  } else if (years >= 8 && years <= 12) {
    key = "8-12 years";
  }

  // 1-st validation...
  if (key === undefined) {
    result.reason = "wrong years";
    result.success = false;
  }

  // 2-st validation...
  const freeIncome = getFreeIncome(orderedTurnState);
  const ins = getTodayInstrument(orderedTurnState, id); // инструмент
  const rate = `${ins[key]}%`;
  const other_credits = orderedTurnState.liabilities.filter(
    l => l.type === "credit"
  );
  const fpid = generateNextFinancialPropertyId(
    orderedTurnState.liabilities,
    id
  );
  let credit = buildCredit(id, "credit", sum, years, rate, fpid);
  const total_year_payment = other_credits.reduce(
    (acc, cur) => acc + cur.periodic_payment,
    credit.periodic_payment
  );
  if (freeIncome < total_year_payment) {
    result.reason = "Sorry, credit is too expensive for you";
    result.success = false;
  }

  return result;
};

export default checkCredit;
