import styles from "./index.module.css";

import React, { Component } from "react";

import { Button } from "@material-ui/core";

class CustomButton extends Component {
  render() {
    const { props } = this;

    return (
      <Button
        {...{
          ...props,
          classes: { root: styles.button, disabled: styles.disabled }
        }}
      />
    );
  }
}

export default CustomButton;
