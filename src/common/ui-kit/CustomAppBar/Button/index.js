import styles from "./index.module.css";

import React, { Component } from "react";

import CustomButton from "common/ui-kit/CustomButton";

class CustomAppBarButton extends Component {
  render() {
    const { props } = this;

    return (
      <CustomButton
        {...{
          ...props,
          className: styles.button
        }}
      />
    );
  }
}

export default CustomAppBarButton;
