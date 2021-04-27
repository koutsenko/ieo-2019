export default (turnState, state) => {
  const { scenario } = state;
  const { taxrates } = scenario;
  const { liabilities, turn } = turnState;
  const index = turnState.gameStartPeriod + turn - 1 - 1;
  const taxrate = taxrates[index];
  const result = {
    ...turnState,
    liabilities: liabilities.reduce((acc, cur) => {
      let result;

      if (cur.type === "current_tax_rate") {
        result = [
          ...acc,
          {
            ...cur,
            value: taxrate
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
