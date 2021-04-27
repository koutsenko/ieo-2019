import styles from "./index.module.css";

import React, { Component } from "react";

import { IconButton } from "@material-ui/core";

import { MoreVert } from "@material-ui/icons";

class CustomButtonDots extends Component {
  render() {
    const { onClick, parentRef } = this.props;

    return (
      <IconButton
        aria-label="Delete"
        className={styles.margin}
        onClick={onClick}
        ref={parentRef}
        size="small"
      >
        <MoreVert fontSize="inherit" />
      </IconButton>
    );
  }
}

export default CustomButtonDots;
