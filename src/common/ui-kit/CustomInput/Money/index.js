import PropTypes from "prop-types";
import React from "react";

import { isFloat, fmt, unformatMoney } from "common/utils/money";
import CustomInput from "common/ui-kit/CustomInput";

const digits = 4;

// about isN see https://stackoverflow.com/a/175787
const validPositive = raw => {
  const value = parseFloat(raw);
  const isDot = raw.length && raw[raw.length - 1] === ".";
  const isN = !isNaN(raw);
  const isF = isFloat(value);
  const isI = Number.isInteger(value);
  const result = !isDot && isN && (isF || isI) && value >= 0;

  return result;
};

const CustomInputMoney = ({ onKeyPress, onChange, value, error }) => {
  let renderedValue;
  if ([undefined, null].includes(value)) {
    renderedValue = "";
  } else if (!validPositive(value)) {
    renderedValue = value;
  } else {
    renderedValue = fmt(value, digits);
  }

  return (
    <CustomInput
      error={error}
      onChange={event => {
        const formattedValue = event.target.value;
        const unformattedValue = unformatMoney(formattedValue);

        onChange(unformattedValue);
      }}
      value={renderedValue}
      onKeyPress={onKeyPress}
    />
  );
};

CustomInputMoney.defaultProps = {
  value: null
};

CustomInputMoney.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CustomInputMoney;
