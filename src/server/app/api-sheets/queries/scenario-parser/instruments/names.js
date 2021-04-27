const parseValues = values => {
  let result = {};

  if (!values) {
    return result;
  }

  result = values.reduce(
    (acc, cur) => ({
      ...acc,
      [cur[0]]: {
        id: cur[0],
        name: cur[1] || "",
        desc: cur[2] || ""
      }
    }),
    {}
  );

  return result;
};

export default values => {
  const result = parseValues(values);

  return result;
};
