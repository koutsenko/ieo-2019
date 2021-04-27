export default turnState => {
  const { turn, gameStartPeriod } = turnState;

  const source1 = turnState.instruments.history;
  const history = Object.keys(source1).reduce((acc, cur) => {
    const filtered = source1[cur].filter(
      byYear => byYear.period - turn - gameStartPeriod + 1 <= 0
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

  const source3 = turnState.events.playerEvents;
  // FIXME так здесь turn или period?
  const playerEvents = Object.keys(source3).reduce(
    (acc, cur) =>
      cur > turn
        ? acc
        : {
            ...acc,
            [cur]: source3[cur]
          },
    {}
  );

  const source4 = turnState.events.globalEvents;
  // FIXME так здесь turn или period?
  const globalEvents = Object.keys(source4).reduce(
    (acc, cur) =>
      cur > turn
        ? acc
        : {
            ...acc,
            [cur]: source4[cur]
          },
    {}
  );

  const source5 = turnState.instruments.names;
  const names = Object.keys(history).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: source5[cur]
    }),
    {}
  );

  const filteredState = {
    ...turnState,
    events: {
      globalEvents,
      playerEvents
    },
    instruments: {
      ...turnState.instruments,
      history,
      meta,
      names
    }
  };

  return filteredState;
};
