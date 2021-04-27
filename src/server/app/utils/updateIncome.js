export default (turnState, state) => {
  const { assets, turn } = turnState;
  const { scenario } = state;
  const { coeffs, globalParams } = scenario;

  const income = parseInt(globalParams["income"], 10);
  const index = turnState.gameStartPeriod + turn - 1 - 1;
  const income_k_raw = coeffs.coeffIncome[index];
  const income_k = income_k_raw === "" ? 1 : parseFloat(income_k_raw);

  const result = {
    ...turnState,
    assets: assets.reduce((acc, cur) => {
      let result;

      if (cur.type === "current_income") {
        result = [
          ...acc,
          {
            ...cur,
            value: income * income_k
          }
        ];
      } else {
        result = [...acc, cur];
      }

      return result;
    }, [])
  };

  return result;
};
