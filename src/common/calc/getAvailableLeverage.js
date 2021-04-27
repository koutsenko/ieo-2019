import sumAssets from "common/calc/sumAssets";
import sumRE from "common/calc/sumRE";
import sumRf from "common/calc/sumRF";

const getAvailableLeverage = (orderedTurnState, id) => {
  const { instruments, reservedCapital, liabilities } = orderedTurnState;
  const { meta } = instruments;
  const { static_params } = meta[id];
  const { sh } = static_params;
  const lk = parseInt(sh.split(":")[1], 10);
  const totalAss = sumAssets(orderedTurnState);
  const RE = sumRE(orderedTurnState);
  const RF = sumRf(orderedTurnState);
  const lc = liabilities.find(l => l.type === "leverage_credit");
  const leverage = lc === undefined ? 0 : lc.principal;
  const result = (totalAss - leverage - RE - RF - reservedCapital) * lk;

  return result;
};

export default getAvailableLeverage;
