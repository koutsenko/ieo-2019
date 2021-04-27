// sheets names
const accountsSheet = "accounts";
const scenarioMainSheet = "main";
const scenarioNamesSheet = "names";
const resultsSheet = "main";

// instruments start column
const isc = "V";

// ranges
const accountsRange = `${accountsSheet}!A1:E`;
const instrumentsHistoryRange = `${scenarioMainSheet}!${isc}2:ZZ`;
const instrumentsMetaRange = `${scenarioMainSheet}!${isc}2:6`;
const instrumentsNamesRange = `${scenarioNamesSheet}!A2:C`;
const playerEventsRange = `${scenarioMainSheet}!D6:D75`;
const globalEventsRange = `${scenarioMainSheet}!I6:I75`;
const globalParamsRange = `${scenarioMainSheet}!A2:B24`;
const incomeCoeffRange = `${scenarioMainSheet}!N6:N75`;
const lifeCostCoeffRange = `${scenarioMainSheet}!O6:O75`;
const rentCoeffRange = `${scenarioMainSheet}!Q6:Q75`;
const taxRateRange = `${scenarioMainSheet}!P6:P75`;
const leverageCostRange = `${scenarioMainSheet}!S6:S75`;
const mortgageLoansRange = `${scenarioMainSheet}!R6:R75`;
const resultsRange = `${resultsSheet}!A1`;

export default {
  HTTP_WEB_PORT: 80,
  WS_API_PORT: 81,
  SERVER_ROOT_DIR: __dirname,
  GOOGLE_SHEETS: {
    accountsRange,
    incomeCoeffRange,
    instrumentsHistoryRange,
    instrumentsMetaRange,
    instrumentsNamesRange,
    lifeCostCoeffRange,
    leverageCostRange,
    globalEventsRange,
    playerEventsRange,
    rentCoeffRange,
    mortgageLoansRange,
    resultsRange,
    globalParamsRange,
    taxRateRange
  }
};
