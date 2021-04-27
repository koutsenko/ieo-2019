import toBucks from "./inc/toBucks";
import toCents from "./inc/toCents";

const sumExpired = turnState => {
  const { expiredBonds } = turnState;

  let cSum = 0;

  expiredBonds.forEach(rf => {
    cSum += toCents(rf.sum);
  });

  return toBucks(cSum);
};

export default sumExpired;
