import { WAIT_FOR_REQUEST } from "common/constants/actions";

const sender = ({ getState }) => next => action => {
  const { type, key, packet } = action;
  const returnValue = next(action);

  if (type === WAIT_FOR_REQUEST) {
    const { ws } = getState().net;
    const message = JSON.stringify({ ...packet, key });

    ws.send(message);
  }

  return returnValue;
};

export default sender;
