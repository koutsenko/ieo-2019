export default (turnState, state) => {
  const { scenario } = state;
  const { mortgageLoanCosts, leverageCreditCosts } = scenario;
  const { turn } = turnState;

  const index = turnState.gameStartPeriod + turn - 1 - 1;

  const currentMortgageLoanCost = mortgageLoanCosts[index];
  const currentLeverageCreditCost = leverageCreditCosts[index];

  const result = {
    ...turnState,
    currentMortgageLoanCost,
    currentLeverageCreditCost
  };

  return result;
};
