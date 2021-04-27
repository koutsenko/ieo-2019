import sumRf from "common/calc/sumRF";
import sumDividends from "common/calc/sumDividends";

const getFreeIncome = turnState => {
  const { assets } = turnState;
  const income = assets.find(a => a.type === "current_income").value;
  const rf = sumRf(turnState);
  const dividendsDelta = sumDividends(turnState);
  let freeIncome = income - rf - dividendsDelta;
  if (freeIncome < 0) {
    freeIncome = 0;
  }

  return freeIncome;
};

export default getFreeIncome;
