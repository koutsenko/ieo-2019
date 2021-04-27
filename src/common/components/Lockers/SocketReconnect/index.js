import styles from "./index.module.css";

import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { connect } from "react-redux";

import { DialogTitle, Typography } from "@material-ui/core";

import createSocket from "common/actions/socket/create";
import resetStore from "common/actions/system/reset";
import DialogWbg from "common/components/Dialogs/WhiteBackground";
import {
  SOCKET_STATUS_OPEN,
  SOCKET_STATUS_CLOSED
} from "common/constants/states/socket";

const mapStateToProps = state => ({
  status: state.net.status
});

const mapDispatchToProps = {
  createSocket,
  resetStore
};

class SocketReconnectLocker extends Component {
  state = {
    time: null,
    timer: null
  };

  componentDidUpdate(prevProps) {
    const { status, resetStore } = this.props;
    const changed = status !== prevProps.status;
    const closed = status === SOCKET_STATUS_CLOSED;

    if (changed && closed) {
      resetStore();
      this.reset();
      this.init();
    }
  }

  tick = () => {
    const nextTime = this.state.time - 1;

    if (nextTime === 0) {
      this.reset();
      this.reconnect();
    } else {
      this.setState({ time: nextTime });
    }
  };

  reconnect() {
    const { cookies, createSocket, tokenName, url } = this.props;

    try {
      createSocket(url, cookies, tokenName);
    } catch (error) {
      console.log("error", error);
    }
  }

  init() {
    this.setState({
      time: 5,
      timer: setInterval(() => {
        this.tick();
      }, 1000)
    });
  }

  reset() {
    clearInterval(this.state.timer);
    this.setState({
      time: null,
      timer: null
    });
  }

  render() {
    const { time } = this.state;
    const { status } = this.props;

    return status !== SOCKET_STATUS_OPEN ? (
      <DialogWbg open={true}>
        <DialogTitle>Server connection lost</DialogTitle>
        <div className={styles.message}>
          {time > 0 ? (
            <Typography>Reconnecting after {time}s</Typography>
          ) : (
            <Typography>Connecting...</Typography>
          )}
        </div>
      </DialogWbg>
    ) : null;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCookies(SocketReconnectLocker));
