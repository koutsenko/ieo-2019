import { DO_JUMP_PERIOD } from "common/constants/api";

const doJumpPeriod = period => ({
  type: DO_JUMP_PERIOD,
  data: { period }
});

export default doJumpPeriod;
