import { ACCOUNTS_LOADED } from "server/app/constants/actions";

const defaultState = {
  admins: [],
  players: []
};

export default (state = defaultState, action) => {
  const { type, accounts } = action;

  switch (type) {
    case ACCOUNTS_LOADED: {
      const admins = accounts.filter((_record, index) => index < 4);
      const players = accounts.map((record, index) => ({
        ...record,
        demiurg: index < 4 ? "1" : "0"
      }));

      players.push({
        demiurg: "0",
        login: "guest",
        name: "Guest",
        password: "guest"
      });

      return { admins, players };
    }

    default:
      return state;
  }
};
