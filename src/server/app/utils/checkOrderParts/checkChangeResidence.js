import { RESIDENCE_OWN, RESIDENCE_RENTAL } from "common/constants/residence";

const checkChangeResidence = (instruments, orderedTurnState, orderData) => {
  let result = { success: true };
  let { id, financialPropertyId } = orderData;
  if (
    orderedTurnState.residence.type === RESIDENCE_OWN &&
    orderedTurnState.residence.financialPropertyId === financialPropertyId
  ) {
    result.reason = "You already live here!";
    result.success = false;
  } else if (
    orderedTurnState.residence.type === RESIDENCE_RENTAL &&
    orderedTurnState.residence.id === id
  ) {
    result.reason = "You already live here!";
    result.success = false;
  }

  return result;
};

export default checkChangeResidence;
