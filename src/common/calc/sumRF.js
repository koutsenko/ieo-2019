export default turnState => {
  const { reservedFunds } = turnState;
  const result = reservedFunds.reduce((acc, cur) => acc + cur.value, 0);

  return result;
};
