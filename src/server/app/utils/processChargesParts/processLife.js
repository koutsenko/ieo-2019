import * as R from "ramda";

export default (turnState, forced) => {
  const { assets, liabilities, reservedFunds } = turnState;
  const income = assets.find(a => a.type === "current_income").value;
  const life_raw = liabilities.find(l => l.type === "current_life").value;
  const life = (income * parseInt(life_raw.split("%")[0])) / 100;

  const index = reservedFunds.findIndex(rf => rf.type === "current_life");
  const rf = R.adjust(
    index,
    rf => ({
      ...rf,
      value: life
    }),
    reservedFunds
  );

  let result = {
    ...turnState,
    money: turnState.money - life,
    reservedFunds: rf
  };

  if (result.money < 0 && forced) {
    result.endByBankruptcy = true;
  }

  return result;
};
