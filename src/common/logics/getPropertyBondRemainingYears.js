/**
 * Получение времени оставшегося до автоматического закрытия бонда.
 */

const getPropertyBondRemainingYears = (financialPropertyId, turnState) => {
  const { instruments, assets, turn } = turnState;
  const property = assets.find(
    a => a.financialPropertyId === financialPropertyId
  );
  const { id, start_turn } = property;
  const { meta } = instruments;
  const { duration } = meta[id].static_params;
  const iDuration = parseInt(duration, 10);
  const usedYears = turn - start_turn;
  const result = iDuration - usedYears;

  return result;
};

export default getPropertyBondRemainingYears;
