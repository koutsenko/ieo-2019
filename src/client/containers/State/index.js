import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import Divider from "client/components/Divider";
import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";
import AssetsTable from "client/containers/State/Assets";
import LiabsTable from "client/containers/State/Liabs";
import { fmt } from "common/utils/money";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

class StateContainer extends Component {
  render() {
    const { orderedTurnState } = this.props;

    return (
      <div className={styles.tables}>
        <div className={styles["table-container"]}>
          <div className={styles.head}>
            <span>Assets</span>
            <span>{fmt(sumAssets(orderedTurnState))}</span>
          </div>
          <div className={styles["table-container-main"]}>
            <AssetsTable />
          </div>
        </div>
        <Divider />
        <div className={styles["table-container"]}>
          <div className={styles.head}>
            <span>{fmt(sumLiabs(orderedTurnState))}</span>
            <span>Liabilities</span>
          </div>
          <div className={styles["table-container-main"]}>
            <LiabsTable />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(StateContainer);
