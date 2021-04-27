import styles from "./index.module.css";

import React, { Component } from "react";

import { CircularProgress, Typography } from "@material-ui/core";

class GameSuspendedLocker extends Component {
  render() {
    return (
      <div className={styles.message}>
        <Typography>Game suspended by demiurgs</Typography>
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
        <Typography>Waiting for resume...</Typography>
      </div>
    );
  }
}

export default GameSuspendedLocker;
