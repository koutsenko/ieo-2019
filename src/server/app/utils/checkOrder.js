import {
  CHANGE_RESIDENCE,
  EARLY_REPAYMENT,
  BUY,
  SELL,
  PAY_LEVERAGE_BODY,
  TAKE_CREDIT
} from "common/constants/orders";
import checkBuy from "server/app/utils/checkOrderParts/checkBuy";
import checkSell from "server/app/utils/checkOrderParts/checkSell";
import checkPayLeverageBody from "server/app/utils/checkOrderParts/checkPayLeverageBody";
import checkEarlyRepayment from "server/app/utils/checkOrderParts/checkEarlyRepayment";
import checkCredit from "server/app/utils/checkOrderParts/checkCredit";
import checkChangeResidence from "server/app/utils/checkOrderParts/checkChangeResidence";

// FIXME add check for string count, here is a lot of count less or greater ops
const checkOrder = (instruments, orderedTurnState, orderData) => {
  const { action } = orderData;

  let result;

  if (action === BUY) {
    result = checkBuy(instruments, orderedTurnState, orderData);
  } else if (action === SELL) {
    result = checkSell(instruments, orderedTurnState, orderData);
  } else if (action === PAY_LEVERAGE_BODY) {
    result = checkPayLeverageBody(instruments, orderedTurnState, orderData);
  } else if (action === EARLY_REPAYMENT) {
    result = checkEarlyRepayment(instruments, orderedTurnState, orderData);
  } else if (action === TAKE_CREDIT) {
    result = checkCredit(instruments, orderedTurnState, orderData);
  } else if (action === CHANGE_RESIDENCE) {
    result = checkChangeResidence(instruments, orderedTurnState, orderData);
  } else {
    result = {
      reason: "unknown order type",
      success: false
    };
  }

  return result;
};

export default checkOrder;
