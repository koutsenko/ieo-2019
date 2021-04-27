import { DO_TURN } from "common/constants/api";

const turn = forced => ({
  data: { forced },
  type: DO_TURN
});

export default turn;
