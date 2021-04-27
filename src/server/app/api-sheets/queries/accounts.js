import * as R from "ramda";

import settings from "server/settings";

export default async state => {
  const api = state.gapi.sheets_api;
  const spreadsheetId = state.system.accounts_file_id;
  const request = {
    range: settings.GOOGLE_SHEETS.accountsRange,
    spreadsheetId,
    valueRenderOption: "FORMATTED_VALUE"
  };
  const response = await api.spreadsheets.values.get(request);
  const columns = response.data.values[0];
  const result = R.remove(0, 1, response.data.values).map(row => ({
    [columns[0]]: row[0],
    [columns[1]]: row[1],
    [columns[2]]: row[2]
  }));

  return result;
};
