import * as R from "ramda";

import toBucks from "common/calc/inc/toBucks";
import toCents from "common/calc/inc/toCents";

export default (turnState, forced) => {
  const nextState = turnState.liabilities
    .filter(l => l.type === "credit")
    .reduce(
      (acc, cur) => {
        // В cur сейчас текущий кредит. А в аккумуляторе болванка нового turnState.
        let result = { ...acc };

        // Тем не менее, уже сейчас узнаем его место в аккумуляторе
        const { financialPropertyId } = cur;

        // Если кредит всё, просто закрываем (удаляем), а копию сохраняем его в closedCredits
        const index = result.liabilities.findIndex(
          l => l.financialPropertyId === financialPropertyId
        );
        // Хак #0 - закрываем кредит если остался бакс и меньше.
        if (cur.principal_remaining < 1) {
          result.closedCredits.push(result.liabilities[index]);
          result.liabilities = R.remove(index, 1, result.liabilities);
        }

        // Вычисляем размер платежа - либо фиксированный платеж по графику, либо хвостовой.
        const { periodic_payment } = cur;
        const isRest = cur.principal_remaining < periodic_payment;
        const payment = isRest ? cur.principal_remaining : periodic_payment;

        // Добавляем новый rf.
        const rf = {
          type: "credit_payment",
          value: payment,
          financialPropertyId
        };
        result.reservedFunds = R.append(rf, result.reservedFunds);

        // Списываем. Если не хватило - банкрот.
        result.money = toBucks(toCents(result.money) - toCents(payment));
        if (result.money < 0 && forced) {
          result.endByBankruptcy = true;
        }

        // Обновляем данные по только что обработанному кредиту
        const years_remaining = cur.years_remaining - 1;
        const principal_remaining = cur.principal_remaining - payment;

        result.liabilities = R.adjust(
          index,
          l => ({
            ...l,
            years_remaining,
            principal_remaining
          }),
          result.liabilities
        );

        return result;
      },
      {
        ...{
          ...turnState,
          reservedFunds: turnState.reservedFunds.filter(
            rf => rf.type !== "credit_payment"
          )
        }
      }
    );

  return nextState;
};
