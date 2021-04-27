import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";

const checkNegativeBalance = turnState => {
  const totalAssets = sumAssets(turnState);
  const totalLiabs = sumLiabs(turnState);
  const balance = parseFloat(totalAssets) - parseFloat(totalLiabs);

  return balance < 0;
};

export default checkNegativeBalance;
