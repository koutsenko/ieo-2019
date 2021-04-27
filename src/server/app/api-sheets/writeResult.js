import settings from "server/settings";

export default async (state, row) => {
  const api = state.gapi.sheets_api;
  const { resultsRange } = settings.GOOGLE_SHEETS;
  const range = resultsRange;
  const resource = {
    values: [row]
  };
  const spreadsheetId = state.system.results_file_id;
  const valueInputOption = "RAW";
  const request = {
    range,
    resource,
    spreadsheetId,
    valueInputOption
  };
  await api.spreadsheets.values.append(request);
};
