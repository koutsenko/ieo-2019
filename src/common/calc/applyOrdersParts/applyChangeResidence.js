import { RESIDENCE_OWN, RESIDENCE_RENTAL } from "common/constants/residence";

const applyChangeResidence = (acc, cur) => {
  const { financialPropertyId, id } = cur;

  if (financialPropertyId !== undefined) {
    acc.residence = {
      type: RESIDENCE_OWN,
      financialPropertyId
    };
  } else if (id !== undefined) {
    acc.residence = {
      type: RESIDENCE_RENTAL,
      id
    };
  }

  return acc;
};

export default applyChangeResidence;
