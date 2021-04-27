const getInstrumentByDay = (turnState, instrumentId, turn) => {
  const { gameStartPeriod, instruments } = turnState;

  const result = instruments.history[instrumentId].find(
    item => item.period === turn + gameStartPeriod - 1
  );

  return result;
};

export default getInstrumentByDay;
