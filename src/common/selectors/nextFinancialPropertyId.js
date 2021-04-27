/**
 * Метод генерирует следующий доступный financialPropertyId, для инструмента:
 * - указанного типа (asset инструмент или liabs инструмент)
 * - указанного id (т.к. в finPropId основной является именно id)
 */
const generateNextFinancialPropertyId = (container, id) => {
  const same_properties = container.filter(c => c.id === id);

  let newId;
  if (same_properties.length === 0) {
    newId = `${id}_0`;
  } else {
    const lastProperty = same_properties[same_properties.length - 1];
    const { financialPropertyId } = lastProperty;
    const parts = financialPropertyId.split("_");
    const index = parseInt(parts[1], 10);
    newId = `${id}_${index + 1}`;
  }

  return newId;
};

export default generateNextFinancialPropertyId;
