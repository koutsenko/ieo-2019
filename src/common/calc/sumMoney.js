import toBucks from "./inc/toBucks";
import toCents from "./inc/toCents";

const sumMoney = turnState => {
  const { money, reservedFunds } = turnState;

  let cSum = toCents(money);

  reservedFunds.forEach(rf => {
    cSum += toCents(rf.value);
  });

  return toBucks(cSum);
};

export default sumMoney;
