import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";
import winValue from "common/calc/winValue";
import {
  createISOnow,
  formatISOtoHuman,
  formatISOtoHumanTimeOnly
} from "common/utils/dates";
import { fmt } from "common/utils/money";

export default (state, nextTurnState) => {
  let reason;
  if (nextTurnState.endByBankruptcy) {
    reason = "Bankrupt";
  } else if (nextTurnState.endByWin) {
    reason = "Winner";
  } else if (nextTurnState.endByPension) {
    reason = "Pension";
  }
  /***
   * rp = retirement period
   * gsp = game start period
   * tttp = turns till the pension
   */
  const rp = parseInt(state.scenario.globalParams["retirement period"]);
  const gsp = parseInt(state.scenario.globalParams["game start period"]);
  const tttp = rp + gsp - nextTurnState.turn;

  /**
   * ta = total assets
   * tl = total liabs
   * wv = win value
   * os = oversavings
   */
  const ta = sumAssets(nextTurnState);
  const tl = sumLiabs(nextTurnState);
  const balance = ta - tl;
  const wv = winValue(nextTurnState);
  const os = balance - wv;

  const data = [
    nextTurnState.game_id,
    nextTurnState.name,
    reason,
    formatISOtoHuman(nextTurnState.game_start_time),
    formatISOtoHumanTimeOnly(nextTurnState.game_start_time),
    formatISOtoHumanTimeOnly(createISOnow()),
    nextTurnState.turn,
    tttp,
    fmt(ta),
    fmt(tl),
    fmt(balance),
    fmt(wv),
    fmt(os),
    nextTurnState.scenario_name,
    formatISOtoHuman(state.system.scenario_file_loaded, true),
    formatISOtoHuman(state.system.scenario_file_lastmod, true)
  ];

  return data;
};
