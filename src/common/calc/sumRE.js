import getTodayInstrument from "../selectors/todayInstrument";

// FIXME добавить учёт состояния
export default turnState => {
  const result = turnState.assets
    .filter(a => a.type === "RE")
    .reduce((acc, cur) => {
      const { id } = cur;
      const { cost } = getTodayInstrument(turnState, id);

      return acc + cost;
    }, 0);

  return result;
};
