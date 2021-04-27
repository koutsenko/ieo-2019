import queryScenario from "server/app/api-sheets/queries/scenario";
import scenarioLoaded from "server/app/actions/scenarioLoaded";

export default store => async () => {
  const state = store.getState();
  const response = {};

  let scenarioData;
  try {
    scenarioData = await queryScenario(state);
    store.dispatch(scenarioLoaded(scenarioData));
    response.success = true;
  } catch (error) {
    response.success = false;
    response.reason = `Problem updating scenario from Google Sheets, error: ${error}`;
  }

  return response;
};
