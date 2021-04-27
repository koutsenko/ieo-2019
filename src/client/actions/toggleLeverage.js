import { TOGGLE_LEVERAGE } from "client/constants/actions";

const toggleLeverage = leverage => ({
  type: TOGGLE_LEVERAGE,
  leverage
});

export default toggleLeverage;
