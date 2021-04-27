/**
 * Метод возвращающий свойство дивиденда для имущества.
 * Вернет либо сумму выплаты в год, либо строку с символом %.
 */

import getTodayInstrument from "common/selectors/todayInstrument";
import chosenDayInstrument from "common/selectors/chosenDayInstrument";

const getPropertyDividendsRate = (financialPropertyId, turnState) => {
  let result;

  const { assets } = turnState;
  const property = assets.find(
    a => a.financialPropertyId === financialPropertyId
  );
  const { id, type, start_turn } = property;

  if (type === "RE") {
    // TODO Переписать логику, что инструмент недвижки = последний известный на рынке.
    // TODO Разрешить коллизию что дивиденды для RE всегда должны быть числом, так как надо применить модификатор износа.
    return "";
  }

  const todayInstrument = getTodayInstrument(turnState, id);
  const instrument =
    type === "Bond"
      ? chosenDayInstrument(turnState, id, start_turn)
      : todayInstrument;
  const d = instrument.dividend;
  const dp = instrument["%,dividend"];

  if (d !== undefined) {
    if (todayInstrument) {
      result = d;
    } else {
      result = 0;
    }
  } else if (dp !== undefined) {
    if (todayInstrument) {
      result = dp;
    } else {
      result = "0%";
    }
  } else {
    result = null;
  }

  return result;
};

export default getPropertyDividendsRate;
