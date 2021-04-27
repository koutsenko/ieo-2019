import buildCredit from "common/calc/buildCredit";
import getFreeIncome from "common/calc/getFreeIncome";
import generateNextFinancialPropertyId from "common/selectors/nextFinancialPropertyId";

/**
 * Check the money available if mortgage taken
 */

const getMortRes = (orderedTurnState, orderData, sum) => {
  const { mortgageData } = orderData;
  const { re_m_years, re_mdp } = mortgageData;
  const { currentMortgageLoanCost, money, liabilities } = orderedTurnState;

  // Client UI prevents that, but we add check.
  if (re_mdp > money) {
    return 0;
  }

  // FIXME copied from checkCredit::L25-L43, с подстановкой других значений
  const freeIncome = getFreeIncome(orderedTurnState);
  const rate = `${currentMortgageLoanCost}`;
  const other_credits = liabilities.filter(l => l.type === "credit");
  const id = 0;
  const fpid = generateNextFinancialPropertyId(liabilities, id);
  let credit = buildCredit(id, "credit", sum - re_mdp, re_m_years, rate, fpid);
  const total_year_payment = other_credits.reduce(
    (acc, cur) => acc + cur.periodic_payment,
    credit.periodic_payment
  );

  if (freeIncome < total_year_payment) {
    return 0;
  }

  return money + sum;
};

export default getMortRes;
