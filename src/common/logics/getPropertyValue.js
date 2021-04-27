/**
 * Метод определения стоимости имущества.
 */

import getPropertyPrice from "common/logics/getPropertyPrice";

const getPropertyValue = (financialPropertyId, turnState) => {
  const { assets } = turnState;
  const price = getPropertyPrice(financialPropertyId, turnState);
  const property = assets.find(
    a => a.financialPropertyId === financialPropertyId
  );
  const { count } = property;
  const result = price * count;

  return result;
};

export default getPropertyValue;
