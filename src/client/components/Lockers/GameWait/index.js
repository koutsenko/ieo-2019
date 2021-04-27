import styles from "./index.module.css";

import React, { Component } from "react";

import { CircularProgress, Typography } from "@material-ui/core";

class GameWaitLocker extends Component {
  render() {
    return (
      <div className={styles.message}>
        <Typography>Seems no game is running.</Typography>
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
        <Typography>Waiting for start...</Typography>
      </div>
    );
  }
}

export default GameWaitLocker;
