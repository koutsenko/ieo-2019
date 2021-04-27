const sumDividends = turnState =>
  turnState.dividends.reduce((acc, cur) => acc + cur.sum, 0);

export default sumDividends;
