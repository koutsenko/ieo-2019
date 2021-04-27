import { REFRESH_SCENARIO } from "admin/constants/actions";

const readScenario = scenario => ({
  type: REFRESH_SCENARIO,
  scenario
});

export default readScenario;
