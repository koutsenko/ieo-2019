import { DO_ORDER } from "common/constants/api";

const doOrder = data => ({
  type: DO_ORDER,
  data
});

export default doOrder;
