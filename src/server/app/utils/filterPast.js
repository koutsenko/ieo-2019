export default turnState => {
  const { historyStartPeriod } = turnState;

  const source1 = turnState.instruments.history;
  const history = Object.keys(source1).reduce((acc, cur) => {
    const filtered = source1[cur].filter(
      item => item.period >= historyStartPeriod
    );
    const result =
      filtered.length === 0
        ? acc
        : {
            ...acc,
            [cur]: filtered
          };

    return result;
  }, {});

  const source2 = turnState.instruments.meta;
  const meta = Object.keys(history).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: source2[cur]
    }),
    {}
  );

  const source3 = turnState.instruments.names;
  const names = Object.keys(history).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: source3[cur]
    }),
    {}
  );

  const filteredState = {
    ...turnState,
    instruments: {
      ...turnState.instruments,
      history,
      meta,
      names
    }
  };

  return filteredState;
};
