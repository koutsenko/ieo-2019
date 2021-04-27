/**
 * Функция по максимуму гасит плечо переданной дельтой.
 * Принимает массив [turnState, dMoney].
 * Возвращает массив [turnState, dMoney].
 */

import * as R from "ramda";

const reduceLeverage = (turnState, dMoney) => {
  const lever_index = turnState.liabilities.findIndex(
    l => l.type === "leverage_credit"
  );

  if (lever_index === -1) {
    return [turnState, dMoney];
  }

  let tS = { ...turnState };
  let dM = dMoney;

  const delta = tS.liabilities[lever_index].principal;
  if (dM >= delta) {
    // плечо гасим полностью, уменьшаем dMoney на его размер
    dM = dM - delta;
    tS.liabilities = R.remove(lever_index, 1, tS.liabilities);
  } else {
    // плечо гасим частично, уменьшаем его на dMoney, сам dMoney = 0
    dM = 0;
    tS.liabilities = R.adjust(
      lever_index,
      l => ({
        ...l,
        principal: l.principal - dM
      }),
      tS.liabilities
    );
  }

  return [tS, dM];
};

export default reduceLeverage;
