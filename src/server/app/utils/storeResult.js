import { STORE_RESULT } from "server/app/constants/actions";

const storeResult = result => ({
  type: STORE_RESULT,
  result
});

export default storeResult;
