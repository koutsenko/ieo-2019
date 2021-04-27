import calcReservedCapital from "common/calc/getReservedCapital";

export default turnState => {
  const nextTurnState = {
    ...turnState,
    reservedCapital: calcReservedCapital(turnState)
  };

  return nextTurnState;
};
