import getTodayInstrument from "common/selectors/todayInstrument";

const getRePrice = (orderedTurnState, id, re_condition) => {
  const instrument = getTodayInstrument(orderedTurnState, id);
  const { cost } = instrument;
  const iCost = parseFloat(cost);
  const { RE_new_markup_percents, RE_old_discount_percents } = orderedTurnState;
  const cost_new = (iCost * (100 + RE_new_markup_percents)) / 100;
  const cost_old = (iCost * (100 - RE_old_discount_percents)) / 100;
  const re_price = {
    new: cost_new,
    normal: cost,
    old: cost_old
  }[re_condition];

  return re_price;
};

export default getRePrice;
