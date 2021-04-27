import { trimDigits } from "common/utils/money";
import getTodayInstrument from "common/selectors/todayInstrument";

const buildCreditColumnData = ({
  data: { id, orderedTurnState, name, range }
}) => {
  const ins = getTodayInstrument(orderedTurnState, id);

  // filter both undefined instrument and instrment with current range undefined
  if (ins === undefined || ins[range] === "") {
    return null;
  }

  const data = [name, trimDigits(ins[range]), range, `${id}___${range}`];

  return data;
};

export default buildCreditColumnData;
