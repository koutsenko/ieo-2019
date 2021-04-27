import sumRf from "common/calc/sumRF";
import sumDividends from "common/calc/sumDividends";

const getOwnedCash = turnState => {
  const { assets, money } = turnState;
  const income = assets.find(a => a.type === "current_income").value;
  const rf = sumRf(turnState);
  const dividendsDelta = sumDividends(turnState);
  let freeIncome = income - rf - dividendsDelta;
  let ownedCash = money - freeIncome;
  if (freeIncome < 0) {
    ownedCash = ownedCash + freeIncome;
    freeIncome = 0;
  }

  return ownedCash;
};

export default getOwnedCash;
