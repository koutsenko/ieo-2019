import { DO_REVERT_TURN } from "common/constants/api";

const doRevertTurn = (login, dropOrders) => ({
  type: DO_REVERT_TURN,
  data: {
    dropOrders,
    login
  }
});

export default doRevertTurn;
