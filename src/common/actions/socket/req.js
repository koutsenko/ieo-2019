import nanoid from "nanoid";

import { WAIT_FOR_REQUEST } from "common/constants/actions";

const req = packet => (dispatch, getState) => {
  const key = nanoid();
  const type = WAIT_FOR_REQUEST;
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const action = { type, key, packet, resolve, reject };

  dispatch(action);
  return promise;
};

export default req;
