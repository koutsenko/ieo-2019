import * as R from "ramda";

export default values => {
  const result = R.remove(0, 1, values).map(v => v[0]);

  return result;
};
