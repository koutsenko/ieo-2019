/**
 * Метод определения цены единицы имущества.
 */

import getTodayInstrument from "common/selectors/todayInstrument";
import chosenDayInstrument from "common/selectors/chosenDayInstrument";

const getPropertyPrice = (financialPropertyId, turnState) => {
  let result;

  const {
    assets,
    RE_new_markup_percents,
    RE_old_discount_percents
  } = turnState;
  const property = assets.find(
    a => a.financialPropertyId === financialPropertyId
  );
  const { id, type, start_turn, re_condition } = property;
  const todayInstrument = getTodayInstrument(turnState, id);
  // TODO Переписать логику, что инструмент недвижки = последний известный на рынке.
  const instrument =
    type === "Bond"
      ? chosenDayInstrument(turnState, id, start_turn)
      : todayInstrument;
  const cost = todayInstrument ? instrument.cost : 0;

  if (type === "Bond") {
    result = cost;
  } else if (type === "RE") {
    const modifier = {
      new: (100 + RE_new_markup_percents) / 100,
      normal: 1,
      old: (100 - RE_old_discount_percents) / 100
    }[re_condition];
    result = cost * modifier;
  } else {
    result = cost;
  }

  return result;
};

export default getPropertyPrice;
