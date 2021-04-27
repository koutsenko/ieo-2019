export default (turnState, state) => {
  const { liabilities, turn } = turnState;
  const { scenario } = state;
  const { coeffs, globalParams } = scenario;

  const life = globalParams["life cost"];
  const index = turnState.gameStartPeriod + turn - 1 - 1;
  const life_k_raw = coeffs.coeffLifeCost[index];
  const life_k = life_k_raw === "" ? 1 : parseFloat(life_k_raw);

  const result = {
    ...turnState,
    liabilities: liabilities.reduce((acc, cur) => {
      let result;

      if (cur.type === "current_life") {
        result = [
          ...acc,
          {
            ...cur,
            value: `${parseInt(life.split("%")[0], 10) * life_k}%`
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
