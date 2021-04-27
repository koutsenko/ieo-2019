import { SCENARIO_LOADED } from "server/app/constants/actions";

export default scenarioData => ({
  type: SCENARIO_LOADED,
  scenarioData
});
