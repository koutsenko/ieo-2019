import styles from "./index.module.css";

import React from "react";

import { Paper, Typography } from "@material-ui/core";

import { fmt } from "common/utils/money";
import winValue from "common/calc/winValue";

const Balance = ({ orderedTurnState }) => {
  return (
    <Paper className={styles.balance}>
      <Typography align="center" className={styles.balanceText}>
        <span className={styles.label}>Balance for win</span>
        {fmt(winValue(orderedTurnState))}
      </Typography>
    </Paper>
  );
};

export default Balance;
