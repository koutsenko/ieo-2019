const checkEarlyRepayment = (instruments, orderedTurnState, orderData) => {
  const { financialPropertyId, sum } = orderData;
  const { liabilities, money } = orderedTurnState;
  const credit = liabilities.find(
    l => l.financialPropertyId === financialPropertyId
  );
  const { principal_remaining } = credit;

  let result = { success: true };

  if (money < sum) {
    result.reason = "not enough money";
    result.success = false;
  } else if (sum <= 0) {
    result.reason = "number must be positive";
    result.success = false;
  } else if (sum > principal_remaining + 1) {
    // Хак #0 - разрешаем довносить на 1 бакс больше
    result.reason = "payment must be less than debt or equal";
    result.success = false;
  }

  return result;
};

export default checkEarlyRepayment;
