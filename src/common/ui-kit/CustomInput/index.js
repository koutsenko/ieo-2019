/**
 * Контрол созданный на замену Material UI TextField.
 * Позволяет как минимум задать высоту.
 */

import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";

class CustomInput extends Component {
  render() {
    const {
      disabled,
      error,
      height,
      onChange,
      onKeyPress,
      placeholder,
      type,
      value
    } = this.props;

    const hasStyleProps = height !== undefined;
    const style = !hasStyleProps
      ? undefined
      : {
          ...(height !== undefined && { height })
        };

    return (
      <input
        {...{
          className: cn(styles.input, { [styles.error]: error }),
          disabled,
          onChange,
          onKeyPress,
          placeholder,
          style,
          type,
          value
        }}
      />
    );
  }
}

export default CustomInput;
