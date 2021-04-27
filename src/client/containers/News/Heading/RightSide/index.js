import styles from "./index.module.css";

import React, { Component } from "react";

import { Typography } from "@material-ui/core";

import { fmt } from "common/utils/money";

class NewsHeadingRightSide extends Component {
  render() {
    const { orderedTurnState } = this.props;

    return (
      <div className={styles.container}>
        <Typography align="center" className={styles.balanceText}>
          <span className={styles.label}>Cash</span>
          <span>&nbsp;</span>
          <span className={styles.value}>{fmt(orderedTurnState.money)}</span>
        </Typography>
      </div>
    );
  }
}

export default NewsHeadingRightSide;
