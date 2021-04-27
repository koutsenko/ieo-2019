/**
 * Функция по максимуму гасит ипотеку.
 * Принимает массив [turnState, dMoney, financialPropertyId].
 * Возвращает массив [turnState, dMoney].
 */

import * as R from "ramda";

import buildCredit from "common/calc/buildCredit";

const reduceMortgage = (turnState, dMoney, financialPropertyId) => {
  const mortgage_index = turnState.liabilities.findIndex(
    l => l.re_id === financialPropertyId
  );

  if (mortgage_index === -1) {
    return [turnState, dMoney];
  }

  let tS = { ...turnState };
  let dM = dMoney;

  const mortgage = tS.liabilities[mortgage_index];
  const { principal_remaining } = mortgage;

  if (dM >= principal_remaining) {
    // ипотеку гасим полностью, уменьшаем dMoney на его размер
    dM = dM - principal_remaining;
    tS.liabilities = R.remove(mortgage_index, 1, tS.liabilities);
  } else {
    // пересоздаем ипотеку, но re_id будет уже null.
    dM = 0;
    tS.liabilities = R.adjust(
      mortgage_index,
      l =>
        buildCredit(
          l.id,
          "credit",
          l.principal_remaining - dM,
          l.years_remaining,
          l.percent,
          l.financialPropertyId,
          {
            re_id: null
          }
        ),
      tS.liabilities
    );
  }

  return [tS, dM];
};

export default reduceMortgage;
