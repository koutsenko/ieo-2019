import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";

import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";
import { fmt } from "common/utils/money";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

class StatusContainer extends Component {
  render() {
    const { orderedTurnState } = this.props;
    const { assets } = orderedTurnState;
    const income = assets.find(f => f.type === "current_income").value;
    const totalAssets = sumAssets(orderedTurnState);
    const totalLiabs = sumLiabs(orderedTurnState);

    return (
      <div className={styles["status-container"]}>
        <span>&nbsp;</span>
        <Typography>
          <span className={styles.label}>Balance</span>
          <span className={styles.value}>
            {fmt(parseFloat(totalAssets) - parseFloat(totalLiabs))}
          </span>
        </Typography>
        <Typography>
          <span className={styles.label}>Income</span>
          <span className={styles.value}>{fmt(income)}</span>
        </Typography>
      </div>
    );
  }
}

export default connect(mapStateToProps)(StatusContainer);
