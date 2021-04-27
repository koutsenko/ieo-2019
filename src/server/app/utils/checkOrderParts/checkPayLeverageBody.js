const checkPayLeverageBody = (instruments, orderedTurnState, orderData) => {
  let result = { success: true };
  let { id } = orderData;
  const { money } = orderedTurnState;
  const { principal } = orderedTurnState.liabilities
    .filter(l => l.type === "leverage_credit")
    .find(l => l.id === id);
  if (money < principal) {
    result.reason = "not enough money";
    result.success = false;
  }

  return result;
};

export default checkPayLeverageBody;
