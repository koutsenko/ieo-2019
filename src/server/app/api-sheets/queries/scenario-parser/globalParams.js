import * as R from "ramda";

export default values => {
  const result = R.remove(0, 1, values).reduce(
    (acc, cur) => ({
      ...acc,
      [cur[0]]: cur[1]
    }),
    {}
  );

  return result;
};
