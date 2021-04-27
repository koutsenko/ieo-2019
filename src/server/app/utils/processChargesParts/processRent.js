import * as R from "ramda";

export default (turnState, forced) => {
  const { liabilities, reservedFunds } = turnState;
  const rent = liabilities.find(l => l.type === "rental").value;

  const index = reservedFunds.findIndex(rf => rf.type === "rental");
  const rf = R.adjust(
    index,
    rf => ({
      ...rf,
      value: rent
    }),
    reservedFunds
  );

  let result = {
    ...turnState,
    money: turnState.money - rent,
    reservedFunds: rf
  };

  if (result.money < 0 && forced) {
    result.endByBankruptcy = true;
  }

  return result;
};
