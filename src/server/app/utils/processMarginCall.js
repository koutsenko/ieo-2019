import applyOrders from "common/calc/applyOrders";
import sumAssets from "common/calc/sumAssets";
import sumRE from "common/calc/sumRE";
import sumRf from "common/calc/sumRF";
import getTodayInstrument from "common/selectors/todayInstrument";
import getInstrumentByDay from "common/selectors/chosenDayInstrument";
import { SELL } from "common/constants/orders";

/**
 * Инком и недвижку не учитываем:
 * - инком вообще по ошибке в ассетах
 * - недвижка не участвует в механике рынка ценных бумаг
 */
const nonSa = ["current_income", "RE"];

export default turnState => {
  // before margin call calculation
  let nextState = {
    ...turnState,
    margin_call_last_data: null
  };

  const {
    assets,
    liabilities,
    margin_call_level_k,
    reservedCapital,
    instruments
  } = nextState;
  const securitiesAssets = assets.filter(t => !nonSa.includes(t.type));
  const totalAss = sumAssets(nextState);
  const RE = sumRE(nextState);
  const RF = sumRf(nextState);
  const ll = liabilities.find(l => l.type === "leverage_credit");
  const leverage = ll ? ll.principal : 0;

  // no mc mechanics if no leverage taken
  if (leverage === 0) {
    return nextState;
  }

  // no mc mechanics if no player has no securities assets
  if (securitiesAssets.length === 0) {
    return nextState;
  }

  const mc =
    totalAss - RE - RF - reservedCapital - leverage <
    margin_call_level_k * reservedCapital;

  // Если маржин колл наступил
  if (mc) {
    // Карта падений инструментов
    const fallMap = securitiesAssets.reduce((acc, cur) => {
      const { id, financialPropertyId } = cur;
      const { type } = instruments.meta[id];

      let result;
      // Бонды в цене хоть и не меняются, но тоже будут распродаваться, просто в последнюю очередь.
      // FIXME Переделать, во всем коде механика бондов прям особняком...
      if (type === "Bond") {
        result = {
          ...acc,
          [financialPropertyId]: 0
        };
      } else {
        const prevIns = getInstrumentByDay(nextState, id, nextState.turn - 1);
        const nextIns = getTodayInstrument(nextState, id);
        result = {
          ...acc,
          [financialPropertyId]: prevIns.cost - (nextIns ? nextIns.cost : 0)
        };
      }

      return result;
    }, {});

    // Сортируем ключи карты (надеюсь по убыванию)
    const fallMapSortedKeys = Object.keys(fallMap).sort(
      (a, b) => fallMap[b] - fallMap[a]
    );

    // mc уже наступил, распродажи гарантированно будут, готовим массив.
    nextState.margin_call_last_data = [];

    // В массиве распродаем по одному инструменты, послужившие причиной падения обеспечения ниже  необходимого уровня
    for (var i = 0; i < fallMapSortedKeys.length; i++) {
      // Генерируем заказ
      const financialPropertyId = fallMapSortedKeys[i];
      const p = assets.find(a => a.financialPropertyId === financialPropertyId);
      const { count, id } = p;
      const order = {
        action: SELL,
        count,
        id,
        financialPropertyId
      };
      nextState.orders.push(order);

      // Сохраняем заказ - покажем на след. экране в диалоге
      nextState.margin_call_last_data.push(order);

      // Конвертируем заказ в бабло и заодно обновляем reservedCapital
      nextState = applyOrders(nextState);

      // Проверка хватит ли распродавать
      const { reservedCapital } = nextState;
      const totalAss = sumAssets(nextState);
      const RE = sumRE(nextState);
      const RF = sumRf(nextState);

      if (reservedCapital <= totalAss - RE - RF) {
        break;
      }
    }
  }

  return nextState;
};
