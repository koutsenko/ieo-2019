import { SCENARIO_FILE_ID } from "server/app/constants/actions";

export default (
  scenario_file_id,
  scenario_file_lastmod,
  scenario_file_loaded
) => ({
  type: SCENARIO_FILE_ID,
  scenario_file_id,
  scenario_file_lastmod,
  scenario_file_loaded
});
