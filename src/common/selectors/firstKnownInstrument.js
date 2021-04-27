/**
 * Предполагается что сервер уже отфильтровал окно данных.
 * Тем не менее мы всё равно начнём считать от history_start_period.
 */

const getFirstKnownInstrument = (turnState, instrumentId) => {
  const { instruments, historyStartPeriod } = turnState;
  const { history } = instruments;
  const currentInstrument = history[instrumentId];
  const periods = currentInstrument.map(r => r.period);

  // Найти в periods наименьшее число, которое больше или равно historyStartPeriod
  const filtered_periods = periods.filter(p => p >= historyStartPeriod);
  const period = Math.min(...filtered_periods);
  const result = history[instrumentId].find(i => i.period === period);

  return result;
};

export default getFirstKnownInstrument;
