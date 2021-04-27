import { ACCOUNTS_LOADED } from "server/app/constants/actions";

export default accounts => ({
  type: ACCOUNTS_LOADED,
  accounts
});
