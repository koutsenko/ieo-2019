import { PLAYER_SLICE_TURNS } from "server/app/constants/actions";

export default (login, start, end) => ({
  end,
  login,
  start,
  type: PLAYER_SLICE_TURNS
});
