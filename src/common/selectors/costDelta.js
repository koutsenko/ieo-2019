const costDelta = (turnState, instrumentId) => {
  const { gameStartPeriod, instruments, turn } = turnState;
  const h = instruments.history[instrumentId];

  const today = h.find(i => i.period === turn + gameStartPeriod - 1);
  // quick fix (no instrument yesterday)
  if (today === undefined) {
    return null;
  }

  const yeday = h.find(i => i.period === turn + gameStartPeriod - 2);
  // quick fix (no instrument yesterday)
  if (yeday === undefined) {
    return null;
  }

  const costToday = parseFloat(today.cost);
  const costYeday = parseFloat(yeday.cost);
  const d = costToday - costYeday;
  const result = Number.isNaN(d) ? null : d;

  return result;
};

export default costDelta;
