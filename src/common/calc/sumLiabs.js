// import toBucks from "./inc/toBucks";
// import toCents from "./inc/toCents";

const sumLiabs = turnState => {
  const { assets, liabilities } = turnState;

  let sum = 0;

  const income = assets.find(a => a.type === "current_income").value;
  const rent = liabilities.find(l => l.type === "rental").value;
  const life_raw = liabilities.find(l => l.type === "current_life").value;
  const life = (income * parseInt(life_raw.split("%")[0])) / 100;
  const taxrate = liabilities.find(l => l.type === "current_tax_rate").value;

  sum += taxrate * income;
  sum += rent;
  sum += life;

  const leverage_credit = liabilities.find(l => l.type === "leverage_credit");
  const credits = liabilities.filter(l => l.type === "credit");

  if (leverage_credit !== undefined) {
    sum += leverage_credit.principal;
  }

  if (credits.length > 0) {
    sum += credits.reduce((acc, cur) => acc + cur.principal_remaining, 0);
  }

  return sum;
};

export default sumLiabs;
