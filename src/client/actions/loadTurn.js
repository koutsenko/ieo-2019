import { PREPARE_TURN } from "client/constants/actions";
import applyOrders from "common/calc/applyOrders";

const loadTurn = turnState => {
  const orderedTurnState = applyOrders(turnState);

  return {
    type: PREPARE_TURN,
    turnState,
    orderedTurnState
  };
};

export default loadTurn;
