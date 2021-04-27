import { DO_LOGIN } from "../constants/api";

const doLogin = (login, password) => ({
  type: DO_LOGIN,
  data: {
    login,
    password
  }
});

export default doLogin;
