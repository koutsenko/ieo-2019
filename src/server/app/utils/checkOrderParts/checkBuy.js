import getAvailableLeverage from "common/calc/getAvailableLeverage";
import { NON_DISCRETE_INSTRUMENTS } from "common/constants/other";
import getTodayInstrument from "common/selectors/todayInstrument";
import { isFloat } from "common/utils/money";
import m from "common/calc/getMortRes";
import getRePrice from "common/calc/getRePrice";

const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value); // https://stackoverflow.com/a/1830632

const checkBuy = (instruments, orderedTurnState, orderData) => {
  const { count, id, useLeverage, mortgageData, re_condition } = orderData;
  const { type, static_params } = instruments.meta[id];
  const { RE_min_dp_percents, money } = orderedTurnState;
  const instrument = getTodayInstrument(orderedTurnState, id);
  const { cost } = instrument;
  const iCost = parseFloat(cost);
  const { minQTY, sh } = static_params;
  const sum = count * iCost;
  const leverage = sh && sum - money;
  const leverage_available = sh && getAvailableLeverage(orderedTurnState, id);
  const resource = mortgageData ? m(orderedTurnState, orderData, sum) : money;
  const min_re_mdp = !mortgageData
    ? 0
    : (getRePrice(orderedTurnState, id, re_condition) * RE_min_dp_percents) /
      100;

  let result = { success: true };

  if (mortgageData && parseFloat(mortgageData.re_mdp) < min_re_mdp) {
    result.reason = "mortgage payment is too low";
    result.success = false;
  } else if (count === null || !isNumber(count)) {
    result.reason = "wrong ordered count";
    result.success = false;
  } else if (!NON_DISCRETE_INSTRUMENTS.includes(type) && isFloat(count)) {
    result.reason = "count must be integer";
    result.success = false;
  } else if (minQTY !== undefined && parseInt(minQTY) > count) {
    result.reason = `too small buy lot, you must order at least ${minQTY}`;
    result.success = false;
  } else if (useLeverage && leverage > leverage_available) {
    result.reason = "Max available leverage limit reached. Reduce you debts.";
    result.success = false;
  } else if (!useLeverage && resource < sum) {
    result.reason = "not enough money";
    result.success = false;
  }

  return result;
};

export default checkBuy;
