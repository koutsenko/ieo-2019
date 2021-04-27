import { DO_LOGIN_BY_TOKEN } from "../constants/api";

const doLoginByToken = token => ({
  type: DO_LOGIN_BY_TOKEN,
  data: {
    token
  }
});

export default doLoginByToken;
