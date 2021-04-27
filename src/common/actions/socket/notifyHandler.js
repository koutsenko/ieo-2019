import { SERVER_NOTIFY } from "common/constants/actions";

const notifyHandler = message => ({
  type: SERVER_NOTIFY,
  message
});

export default notifyHandler;
