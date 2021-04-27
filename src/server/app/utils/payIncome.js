import * as R from "ramda";

export default turnState => {
  const { assets, liabilities, reservedFunds } = turnState;
  const { value } = assets.find(a => a.type === "current_income");
  const tr = liabilities.find(l => l.type === "current_tax_rate").value;
  const tax = value * tr;
  const index = reservedFunds.findIndex(rf => rf.type === "current_tax_rate");

  const result = {
    ...turnState,
    money: turnState.money + value - tax,
    reservedFunds: R.adjust(
      index,
      rf => ({
        ...rf,
        value: tax
      }),
      reservedFunds
    )
  };

  return result;
};
