const parseStaticParams = params => {
  const result =
    params.length === 0
      ? {}
      : params.split(";").reduce((acc, cur) => {
          const kv = cur.split("=");

          return {
            ...acc,
            [kv[0]]: kv[1]
          };
        }, {});

  return result;
};

const parseValues = values => {
  let result = {};

  if (!values) {
    return result;
  }

  const indices = values[0].reduce(
    (acc, cur, index) => (cur === "" ? acc : [...acc, index]),
    []
  );

  // last element is just terminator
  result = indices.reduce(
    (acc, cur, index) =>
      index + 1 === indices.length
        ? acc
        : {
            ...acc,
            [values[0][cur]]: {
              id: values[0][cur],
              type: values[1][cur],
              name: values[2][cur],
              static_params: parseStaticParams(values[3][cur]),
              params: values[4].slice(cur, indices[indices.indexOf(cur) + 1])
            }
          },
    {}
  );

  return result;
};

export default values => {
  const result = parseValues(values);

  return result;
};
