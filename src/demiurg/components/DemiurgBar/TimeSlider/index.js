import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import { Button } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";
import { FastForward, FastRewind, PlayArrow } from "@material-ui/icons";

import doJumpPeriod from "demiurg/actions/doJumpPeriod";
import loadTurn from "client/actions/loadTurn";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import { throttleAsync } from "common/utils/throttle";

const mapStateToProps = state => ({
  turnState: state.game.turnState,
  currentPeriod:
    state.game.turnState.gameStartPeriod + state.game.turnState.turn - 1
});

const mapDispatchToProps = {
  loadTurn,
  req,
  showSnackbar
};

class StepSlider extends Component {
  state = {
    slider_period: null
  };

  handleChange = async (event, period) => {
    const { loadTurn, req, showSnackbar } = this.props;
    this.setState(
      {
        slider_period: period
      },
      () => {
        throttleAsync(async () => {
          try {
            const { slider_period } = this.state;
            const turnState = await req(doJumpPeriod(slider_period));
            loadTurn(turnState);
            this.setState({
              slider_period: turnState.gameStartPeriod + turnState.turn - 1
            });
          } catch (error) {
            showSnackbar(false, `Command error: ${error}`);
          }
        });
      }
    );
  };

  start = async () => {
    const { loadTurn, req, showSnackbar, turnState } = this.props;
    const { gameStartPeriod } = turnState;

    try {
      const turnState = await req(doJumpPeriod(gameStartPeriod));
      loadTurn(turnState);
    } catch (error) {
      showSnackbar(false, `Command error: ${error}`);
    }
  };

  end = async () => {
    const { loadTurn, req, showSnackbar, turnState } = this.props;
    const { retirementPeriod } = turnState;

    try {
      const turnState = await req(doJumpPeriod(retirementPeriod));
      loadTurn(turnState);
    } catch (error) {
      showSnackbar(false, `Command error: ${error}`);
    }
  };

  next = async () => {
    const { loadTurn, currentPeriod, req, showSnackbar } = this.props;

    try {
      const turnState = await req(doJumpPeriod(currentPeriod + 1));
      loadTurn(turnState);
    } catch (error) {
      showSnackbar(false, `Command error: ${error}`);
    }
  };

  prev = async () => {
    const { loadTurn, currentPeriod, req, showSnackbar } = this.props;

    try {
      const turnState = await req(doJumpPeriod(currentPeriod - 1));
      loadTurn(turnState);
    } catch (error) {
      showSnackbar(false, `Command error: ${error}`);
    }
  };

  render() {
    const { slider_period } = this.state;
    const { turnState } = this.props;
    const { gameStartPeriod, retirementPeriod, turn } = turnState;
    const currentPeriod = gameStartPeriod + turn - 1;

    return (
      <div className={styles.root}>
        <div className={styles.left}>
          <div className={styles.label}>{gameStartPeriod}</div>
          <div>
            <Button
              classes={{ root: styles.btn }}
              onClick={this.start}
              variant="outlined"
            >
              <FastRewind />
            </Button>
            <Button
              classes={{ root: styles.btn }}
              onClick={this.prev}
              variant="outlined"
            >
              <PlayArrow style={{ transform: "scaleX(-1)" }} />
            </Button>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.current}>{currentPeriod}</div>
          <Slider
            classes={{ container: styles.slider }}
            value={slider_period || currentPeriod}
            min={gameStartPeriod}
            max={retirementPeriod}
            step={1}
            onChange={this.handleChange}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.label}>{retirementPeriod}</div>
          <div>
            <Button
              classes={{ root: styles.btn }}
              onClick={this.next}
              variant="outlined"
            >
              <PlayArrow />
            </Button>
            <Button
              classes={{ root: styles.btn }}
              onClick={this.end}
              variant="outlined"
            >
              <FastForward />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepSlider);
