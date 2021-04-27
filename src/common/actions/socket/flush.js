import { FINISH_REQUEST } from "common/constants/actions";

const finishRequest = key => ({
  type: FINISH_REQUEST,
  key
});

export default finishRequest;
