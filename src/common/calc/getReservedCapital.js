import getTodayInstrument from "../selectors/todayInstrument";
import chosenDayInstrument from "../selectors/chosenDayInstrument";

export default turnState => {
  const { assets, instruments } = turnState;
  const { meta } = instruments;
  const enumerableAssets = assets.filter(a => a.type !== "current_income");
  const nonReAssets = enumerableAssets.filter(a => a.type !== "RE");
  const result = nonReAssets.reduce((acc, cur) => {
    let result = acc;

    const { id, type, count, start_turn } = cur;

    // check instrument - bond needs dividends got from the buy date
    let instrument;
    if (type === "Bond") {
      instrument = chosenDayInstrument(turnState, id, start_turn);
    } else {
      instrument = getTodayInstrument(turnState, id);
    }

    // if no instrument - its toilet paper. RE is already excluded...
    if (!instrument) {
      return result;
    }

    const { cost } = instrument;
    const { static_params } = meta[id];
    const { sh } = static_params;
    const leverage_multiplier = parseInt(sh.split(":")[1], 10);

    result += (cost * count) / leverage_multiplier;

    return result;
  }, 0);

  return result;
};
