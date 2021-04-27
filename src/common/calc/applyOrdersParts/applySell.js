import * as R from "ramda";

import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";
import reduceLeverage from "common/calc/reduceLeverage";
import reduceMortgage from "common/calc/reduceMortgage";
import getInstrumentByDay from "common/selectors/chosenDayInstrument";
import getTodayInstrument from "common/selectors/todayInstrument";

const applySell = (acc, cur) => {
  const { count, id, financialPropertyId, re_condition } = cur;
  const { instruments, RE_new_markup_percents, RE_old_discount_percents } = acc;
  const { meta } = instruments;
  const { type } = meta[id];

  let instrument;
  if (type === "Bond") {
    const { start_turn } = acc.assets.find(
      a => a.financialPropertyId === financialPropertyId
    );

    instrument = getInstrumentByDay(acc, id, start_turn);
  } else {
    instrument = getTodayInstrument(acc, id);
  }
  const { cost } = instrument;

  // find or create asset. we assume that all solding orders have financialPropertyId
  let index = acc.assets.findIndex(
    a => a.financialPropertyId === financialPropertyId
  );

  const iCost = parseFloat(cost);
  const iCount = parseFloat(count);
  const dCount = iCount * -1;

  // насколько реально изменится сумма
  let dMoney;

  if (type === "Bond") {
    // опять заморочки чтобы узнать start_turn
    const asset = acc.assets.find(
      a => a.financialPropertyId === financialPropertyId
    );
    if (acc.turn !== asset.start_turn) {
      // надо применить штраф.
      const { bonds_discount_percents } = acc;
      const k = (100 - parseFloat(bonds_discount_percents)) / 100;
      dMoney = -1 * iCost * dCount * k;
    } else {
      // все нормально
      dMoney = -1 * iCost * dCount;
    }
  } else if (type === "RE") {
    const cost_new = (cost * (100 + RE_new_markup_percents)) / 100;
    const cost_old = (cost * (100 - RE_old_discount_percents)) / 100;
    // Цена недвижки - стоимость 1 юнита с учетом состояния
    dMoney = {
      new: cost_new,
      normal: cost,
      old: cost_old
    }[re_condition];
  } else {
    // все нормально
    dMoney = -1 * iCost * dCount;
  }

  // calc and update avgBuyCosts before we changed data
  const sCount = acc.assets[index].count + dCount;
  acc.avgBuyCosts = {
    ...acc.avgBuyCosts,
    [id]:
      sCount === 0
        ? 0
        : toBucks(
            (toCents(acc.avgBuyCosts[id] || 0) * acc.assets[index].count +
              toCents(iCost) * dCount) /
              sCount
          )
  };

  // update assets counters immutable way (started using ramda)
  const nextC = acc.assets[index].count + dCount;
  if (nextC === 0) {
    acc.assets = R.remove(index, 1, acc.assets);
  } else {
    acc.assets = R.adjust(index, a => ({ ...a, count: nextC }), acc.assets);
  }

  // case if need reduce leverage first.
  if (type !== "RE") {
    const [tS, dM] = reduceLeverage(acc, dMoney);
    acc = tS;
    dMoney = dM;
  } else {
    // reduce or close credit if need
    const [tS, dM] = reduceMortgage(acc, dMoney, financialPropertyId);
    acc = tS;
    dMoney = dM;
  }

  // change money
  acc.money = toBucks(toCents(acc.money) + toCents(dMoney));

  return acc;
};

export default applySell;
