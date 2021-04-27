import reduceLeverage from "common/calc/reduceLeverage";
import getInstrumentByDay from "common/selectors/chosenDayInstrument";

export default turnState => {
  let nextTurnState = {
    ...turnState,
    expiredBonds: []
  };

  const { assets, turn, instruments } = turnState;
  const bonds = assets.filter(a => a.type === "Bond");
  const expired = bonds.filter(b => b.end_turn === turn);
  const { names } = instruments;

  nextTurnState.expiredBonds = expired.map(e => {
    const instrument = getInstrumentByDay(turnState, e.id, e.start_turn);
    const startCost = parseFloat(instrument.cost);
    const { id, financialPropertyId, count } = e;

    return {
      id,
      financialPropertyId,
      name: names[e.id].name,
      sum: startCost * count
    };
  });

  nextTurnState.assets = nextTurnState.assets.filter(
    a => a.type !== "Bond" || (a.type === "Bond" && a.end_turn !== turn)
  );

  let dMoney = nextTurnState.expiredBonds.reduce(
    (acc, cur) => acc + cur.sum,
    0
  );

  // case if need reduce leverage.
  const [tS, dM] = reduceLeverage(nextTurnState, dMoney);
  nextTurnState = tS;
  dMoney = dM;

  nextTurnState.money = nextTurnState.money + dMoney;

  return nextTurnState;
};
