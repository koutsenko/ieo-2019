const getTodayInstrument = (turnState, instrumentId) => {
  const { gameStartPeriod, instruments, turn } = turnState;

  const result = instruments.history[instrumentId].find(
    item => item.period === turn + gameStartPeriod - 1
  );

  return result;
};

export default getTodayInstrument;
