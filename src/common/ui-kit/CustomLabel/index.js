import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";

import { Typography } from "@material-ui/core";

class CustomLabel extends Component {
  render() {
    const { color, transparent } = this.props;
    const align = this.props.align || "right";

    return (
      <Typography
        align={align}
        classes={{
          root: cn(styles.main, { [styles.transparent]: transparent })
        }}
        style={color ? { color } : null}
      >
        {this.props.children}
      </Typography>
    );
  }
}

export default CustomLabel;
