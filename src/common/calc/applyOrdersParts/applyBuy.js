import * as R from "ramda";

import buildCredit from "common/calc/buildCredit";
import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";
import buildBond from "common/calc/buildBond";
import getTodayInstrument from "common/selectors/todayInstrument";
import generateNextFinancialPropertyId from "common/selectors/nextFinancialPropertyId";

const applyBuy = (acc, cur) => {
  const { currentMortgageLoanCost, instruments, liabilities, turn } = acc;
  const { meta } = instruments;
  const { count, id, useLeverage, mortgageData, re_condition } = cur;
  const { static_params, type } = meta[id];
  const instrument = getTodayInstrument(acc, id);
  const { cost } = instrument;

  // find or create asset
  let index;

  let re_id;
  // при покупки недвижки это всегда отдельная запись в таблице
  if (type === "RE") {
    re_id = generateNextFinancialPropertyId(acc.assets, id);
    const newAsset = {
      id,
      financialPropertyId: re_id,
      count: 0,
      re_condition,
      re_condition_last_update_turn: turn,
      type
    };
    acc.assets = R.append(newAsset, acc.assets);
    index = acc.assets.length - 1;
  } else if (type === "Bond") {
    // при покупке бондов это новая запись только если не совпадают ход и id
    index = acc.assets.findIndex(a => a.start_turn === turn && a.id === id);
    if (index === -1) {
      const start_turn = turn;
      const end_turn = turn + parseInt(static_params.duration);
      const newAsset = buildBond(
        id,
        start_turn,
        end_turn,
        generateNextFinancialPropertyId(acc.assets, id),
        0
      );
      acc.assets = R.append(newAsset, acc.assets);
      index = acc.assets.length - 1;
    }
  } else {
    index = acc.assets.findIndex(a => a.id === id);
    if (index === -1) {
      const newAsset = {
        id,
        count: 0,
        financialPropertyId: generateNextFinancialPropertyId(acc.assets, id)
      };
      acc.assets = R.append(newAsset, acc.assets);
      index = acc.assets.length - 1;
    }
  }

  const iCost = parseFloat(cost);
  const dCount = parseFloat(count);

  // насколько реально изменится сумма. Стартовое значение
  let dMoney = -1 * iCost * dCount;

  // buy with leverage and it's really needed?
  if (useLeverage && Math.abs(dMoney) > acc.money) {
    const principal = toBucks(toCents(Math.abs(dMoney) - acc.money));

    // find liabs for leverage credit id
    const lc_index = acc.liabilities.findIndex(
      l => l.type === "leverage_credit"
    );

    if (lc_index === -1) {
      // update liabilities data pointer
      const newLiab = {
        type: "leverage_credit",
        principal
      };
      acc.liabilities = R.append(newLiab, acc.liabilities);
    } else {
      acc.liabilities = R.adjust(
        lc_index,
        l => ({
          ...l,
          principal: l.principal + principal
        }),
        acc.liabilities
      );
    }

    // spent all money
    dMoney = -1 * acc.money;
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

  // if mortgage, create credit and append money
  // code below based on getMortRes and applyTakeCredit.
  if (mortgageData) {
    /**
     * Осторожно!
     * Привязываю идентификатор квартиры re_id к кредиту, не наоборот.
     * Потому что генератор не на макс. счетчике сделан, а на текущем.
     * Т.е. при продаже квартиры и покупке новой, новая получит такой же идентификатор как и старая.
     */
    const id = 0;
    const fpid = generateNextFinancialPropertyId(liabilities, id);
    const { re_m_years, re_mdp } = mortgageData;
    const sum = dCount * iCost;
    const rate = `${currentMortgageLoanCost}`;
    const principal = sum - parseFloat(re_mdp); // FIXME пришлось дописывать parseFloat
    const credit = buildCredit(
      id,
      "credit",
      principal,
      re_m_years,
      rate,
      fpid,
      { re_id }
    );

    dMoney = -1 * parseFloat(re_mdp);
    acc.liabilities = R.append(credit, acc.liabilities);
  }

  // change money
  acc.money = toBucks(toCents(acc.money) + toCents(dMoney));

  return acc;
};

export default applyBuy;
