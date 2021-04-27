import styles from "./index.module.css";

import cn from "classnames";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import BarToggler from "./BarToggler";
// import RefreshReplay from "./RefreshReplay";
import TimeSlider from "./TimeSlider";

const mapStateToProps = state => ({
  demiurgCollapsed: state.uiclient.demiurgCollapsed,
  turnState: state.game.turnState
});

class DemiurgBar extends Component {
  render() {
    const { demiurgCollapsed, turnState } = this.props;

    return (
      <div
        className={cn(styles["demiurg-bar"], {
          [styles["demiurg-bar-collapsed"]]: demiurgCollapsed
        })}
      >
        <BarToggler />
        {!demiurgCollapsed && (
          <Fragment>
            {/* <RefreshReplay /> */}
            {turnState !== undefined && <TimeSlider />}
          </Fragment>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(DemiurgBar);
