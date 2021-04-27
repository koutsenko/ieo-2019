import { NON_DISCRETE_INSTRUMENTS } from "common/constants/other";
import { isFloat } from "common/utils/money";
import { RESIDENCE_OWN } from "common/constants/residence";

const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value); // https://stackoverflow.com/a/1830632

const checkSell = (instruments, orderedTurnState, orderData) => {
  const { assets, residence } = orderedTurnState;
  const { count, financialPropertyId } = orderData;
  const prop = assets.find(b => b.financialPropertyId === financialPropertyId);
  const { id } = prop;
  const { type } = instruments.meta[id];
  const rt = residence.type;
  const rfpid = residence.financialPropertyId;

  let result = { success: true };

  if (count === null || !isNumber(count)) {
    result.reason = "wrong ordered count";
    result.success = false;
  } else if (!NON_DISCRETE_INSTRUMENTS.includes(type) && isFloat(count)) {
    result.reason = "count must be integer";
    result.success = false;
  } else if (prop === undefined) {
    result.reason = "you don't own selected instrument";
    result.success = false;
  } else if (count > prop.count) {
    result.reason = "you don't owns requested count";
    result.success = false;
  } else if (rt === RESIDENCE_OWN && rfpid === financialPropertyId) {
    result.reason = "you lives here. change residence first";
    result.success = false;
  }

  return result;
};

export default checkSell;
