import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";
import winValue from "common/calc/winValue";

export default turnState => {
  const { gameStartPeriod, retirementPeriod, turn } = turnState;
  const currentPeriod = gameStartPeriod + turn - 1;

  const result = {
    ...turnState
  };

  if (currentPeriod === retirementPeriod) {
    result.endByPension = true;
  } else {
    const totalAssets = sumAssets(turnState);
    const totalLiabs = sumLiabs(turnState);
    const total = parseFloat(totalAssets) - parseFloat(totalLiabs);
    if (total > winValue(turnState)) {
      result.endByWin = true;
    }
  }

  return result;
};
