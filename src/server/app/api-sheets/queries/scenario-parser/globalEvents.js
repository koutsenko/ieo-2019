import * as R from "ramda";

export default values => {
  const result = R.remove(0, 1, values).reduce(
    (acc, cur, index) =>
      cur[0] === undefined
        ? acc
        : {
            ...acc,
            [index + 1]: {
              message: cur[0]
            }
          },
    {}
  );

  return result;
};
