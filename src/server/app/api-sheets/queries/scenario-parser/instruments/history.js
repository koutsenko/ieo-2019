const parseValues = values => {
  let result = [];

  const indices = values[0].reduce(
    (acc, cur, index) => (cur === "" ? acc : [...acc, index]),
    []
  );

  result = indices.reduce((acc, cur) => {
    let result;

    const id = values[0][cur];
    const nextIndex = indices[indices.indexOf(cur) + 1];
    if (id === indices.length) {
      // just terminator
      result = acc;
    } else {
      const params = values[4].slice(cur, nextIndex);
      const rows = values.slice(5, values.length - 1);
      const instrumentHistory = rows.map((r, index) => {
        const slice = r.slice(cur, nextIndex);
        const instrumentHistoryAtom = {
          id,
          period: index + 1,
          ...params.reduce(
            (a, c, i) => ({
              ...a,
              [c]: slice[i]
            }),
            {}
          )
        };

        return instrumentHistoryAtom;
      });

      let realInstrumentHistory = instrumentHistory;

      // filter by empty cost
      realInstrumentHistory = realInstrumentHistory.filter(a => a.cost !== "");

      // filter by all other cells empty if no cost (e.g. type === 'credit')
      realInstrumentHistory = realInstrumentHistory.filter(
        a =>
          a.cost !== undefined ||
          (a.cost === undefined &&
            !Object.keys(a)
              .filter(k => !["id", "period"].includes(k))
              .every(key => a[key] === ""))
      );

      result = { ...acc, [id]: realInstrumentHistory };
    }

    return result;
  }, {});

  return result;
};

export default values => {
  const result = parseValues(values);

  return result;
};
