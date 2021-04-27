import { SHEETS_API_INIT } from "server/app/constants/actions";

export default sheets_api => ({
  type: SHEETS_API_INIT,
  sheets_api
});
