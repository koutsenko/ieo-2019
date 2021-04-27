import toBucks from "./inc/toBucks";
import toCents from "./inc/toCents";
import sumMoney from "./sumMoney";
import getTodayInstrument from "../selectors/todayInstrument";
import getInstrumentByDay from "../selectors/chosenDayInstrument";

const sumAssets = turnState => {
  const {
    assets,
    instruments,
    RE_new_markup_percents,
    RE_old_discount_percents
  } = turnState;
  const { meta } = instruments;

  let cSum = toCents(sumMoney(turnState));

  const enumerableAssets = assets.filter(a => a.type !== "current_income");
  enumerableAssets.forEach(asset => {
    const { id, count } = asset;
    const { type } = meta[id];
    const instrument =
      type === "Bond"
        ? getInstrumentByDay(turnState, id, asset.start_turn)
        : getTodayInstrument(turnState, id);

    if (instrument !== undefined) {
      const { cost } = instrument;
      const { re_condition } = asset;

      let re_cost;
      if (type === "RE") {
        const cost_new = (cost * (100 + RE_new_markup_percents)) / 100;
        const cost_old = (cost * (100 - RE_old_discount_percents)) / 100;
        // Цена недвижки - стоимость 1 юнита с учетом состояния
        re_cost = {
          new: cost_new,
          normal: cost,
          old: cost_old
        }[re_condition];
      }

      cSum += toCents(parseFloat(type === "RE" ? re_cost : cost)) * count;
    }
  });

  return toBucks(cSum);
};

export default sumAssets;
