import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";

import toggleLeverage from "client/actions/toggleLeverage";
import CustomSwitch from "common/ui-kit/CustomSwitch";

const mapStateToProps = state => ({
  leverage: state.uiclient.leverage
});

const mapDispatchToProps = {
  toggleLeverage
};

class LeverageSwitch extends Component {
  render() {
    const { leverage, toggleLeverage } = this.props;

    return (
      <div className={styles["leverage"]}>
        <Typography>Use leverage:</Typography>
        <div className={styles["leverage-switch"]}>
          <CustomSwitch
            checked={leverage}
            onChange={() => {
              toggleLeverage(!leverage);
            }}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeverageSwitch);
