const winValue = turnState => {
  const {
    gameEndPeriod,
    gameStartPeriod,
    liabilities,
    reservedFunds,
    retirementPension,
    retirementPeriod,
    turn
  } = turnState;

  const turnsRemaining = retirementPeriod - gameStartPeriod - turn + 1;
  const turnsRetirement = gameEndPeriod - retirementPeriod;
  const X = turnsRemaining + turnsRetirement;

  const rent = liabilities.find(l => l.type === "rental").value;
  const life = reservedFunds.find(rf => rf.type === "current_life").value;
  const Y = rent + life - retirementPension;

  const result = X * Y;

  return result;
};

export default winValue;
