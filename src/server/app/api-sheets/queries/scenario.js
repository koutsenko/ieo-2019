import parseCoeffIncome from "./scenario-parser/coefficients/income";
import parseCoeffLifeCost from "./scenario-parser/coefficients/lifecost";
import parseCoeffRent from "./scenario-parser/coefficients/rent";
import parseGlobalEvents from "./scenario-parser/globalEvents";
import parseGlobalParams from "./scenario-parser/globalParams";
import parseInstrumentsHistory from "./scenario-parser/instruments/history";
import parseInstrumentsMeta from "./scenario-parser/instruments/meta";
import parseInstrumentsNames from "./scenario-parser/instruments/names";
import parsePlayerEvents from "./scenario-parser/playerEvents";
import parseTaxRates from "./scenario-parser/taxrate";
import parseLeverageCredits from "./scenario-parser/leverageCredits";
import parseMortgageLoans from "./scenario-parser/mortgageLoans";
import settings from "server/settings";

const queryScenario = async state => {
  const api = state.gapi.sheets_api;
  const spreadsheetId = state.system.scenario_file_id;
  const scenarioData = {};
  const valueRenderOption = "FORMATTED_VALUE";
  const request = {
    ranges: [
      settings.GOOGLE_SHEETS.incomeCoeffRange,
      settings.GOOGLE_SHEETS.lifeCostCoeffRange,
      settings.GOOGLE_SHEETS.rentCoeffRange,
      settings.GOOGLE_SHEETS.globalParamsRange,
      settings.GOOGLE_SHEETS.instrumentsHistoryRange,
      settings.GOOGLE_SHEETS.instrumentsMetaRange,
      settings.GOOGLE_SHEETS.instrumentsNamesRange,
      settings.GOOGLE_SHEETS.playerEventsRange,
      settings.GOOGLE_SHEETS.taxRateRange,
      settings.GOOGLE_SHEETS.leverageCostRange,
      settings.GOOGLE_SHEETS.mortgageLoansRange,
      settings.GOOGLE_SHEETS.globalEventsRange
    ],
    spreadsheetId,
    valueRenderOption
  };

  let response;
  let res;
  try {
    response = await api.spreadsheets.values.batchGet(request);
    res = response.data.valueRanges;
  } catch (error) {
    throw new Error(`queryScenario spreadsheet req error: ${error}`);
  }

  // parsing values

  try {
    scenarioData.coeffIncome = parseCoeffIncome(res[0].values);
  } catch (error) {
    throw new Error(`queryCoeffIncome error: ${error}`);
  }

  try {
    scenarioData.coeffLifeCost = parseCoeffLifeCost(res[1].values);
  } catch (error) {
    throw new Error(`queryCoeffLifeCost error: ${error}`);
  }

  try {
    scenarioData.coeffRent = parseCoeffRent(res[2].values);
  } catch (error) {
    throw new Error(`queryCoeffRent error: ${error}`);
  }

  try {
    scenarioData.globalParams = parseGlobalParams(res[3].values);
  } catch (error) {
    throw new Error(`queryGlobalParams error: ${error}`);
  }

  try {
    scenarioData.history = parseInstrumentsHistory(res[4].values);
  } catch (error) {
    throw new Error(`queryInstrumentsHistory error: ${error}`);
  }

  try {
    scenarioData.meta = parseInstrumentsMeta(res[5].values);
  } catch (error) {
    throw new Error(`queryInstrumentsMeta error: ${error}`);
  }

  try {
    scenarioData.names = parseInstrumentsNames(res[6].values);
  } catch (error) {
    throw new Error(`queryInstrumentsNames error: ${error}`);
  }

  try {
    scenarioData.playerEvents = parsePlayerEvents(res[7].values);
  } catch (error) {
    throw new Error(`queryPlayerEvents error: ${error}`);
  }

  try {
    scenarioData.taxrates = parseTaxRates(res[8].values);
  } catch (error) {
    throw new Error(`queryTaxRates error: ${error}`);
  }

  try {
    scenarioData.leverageCreditCosts = parseLeverageCredits(res[9].values);
  } catch (error) {
    throw new Error(`queryLeverageCreditCosts error: ${error}`);
  }

  try {
    scenarioData.mortgageLoanCosts = parseMortgageLoans(res[10].values);
  } catch (error) {
    throw new Error(`queryMortgageLoanCosts error: ${error}`);
  }

  try {
    scenarioData.globalEvents = parseGlobalEvents(res[11].values);
  } catch (error) {
    throw new Error(`queryGlobalEvents error: ${error}`);
  }

  return scenarioData;
};

export default queryScenario;
