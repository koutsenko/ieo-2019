/**
 * Order-to-assets/liabilities converter
 * Used:
 * - by client, to reflect orders to state
 * - by server, to commit orders
 */

import calcReservedCapital from "common/calc/getReservedCapital";
import * as Orders from "common/constants/orders";

import applyBuy from "common/calc/applyOrdersParts/applyBuy";
import applySell from "common/calc/applyOrdersParts/applySell";
import applyPayLeverage from "common/calc/applyOrdersParts/applyPayLeverage";
import applyEarlyRepayment from "common/calc/applyOrdersParts/applyEarlyRepayment";
import applyTakeCredit from "common/calc/applyOrdersParts/applyTakeCredit";
import applyChangeResidence from "common/calc/applyOrdersParts/applyChangeResidence";

const applyOrders = turnState => {
  if (turnState === undefined) {
    return undefined;
  }

  // iterating orders and changing assets/liabs, money and other related params
  const orderedTurnState = turnState.orders.reduce(
    (acc, cur) => {
      const { action } = cur;

      if (action === Orders.BUY) {
        acc = applyBuy(acc, cur);
      } else if (action === Orders.SELL) {
        acc = applySell(acc, cur);
      } else if (action === Orders.PAY_LEVERAGE_BODY) {
        acc = applyPayLeverage(acc, cur);
      } else if (action === Orders.EARLY_REPAYMENT) {
        acc = applyEarlyRepayment(acc, cur);
      } else if (action === Orders.TAKE_CREDIT) {
        acc = applyTakeCredit(acc, cur);
      } else if (action === Orders.CHANGE_RESIDENCE) {
        acc = applyChangeResidence(acc, cur);
      }

      // update rc
      acc.reservedCapital = calcReservedCapital(acc);

      return acc;
    },
    {
      ...turnState,
      orders: []
    }
  );

  return orderedTurnState;
};

export default applyOrders;
