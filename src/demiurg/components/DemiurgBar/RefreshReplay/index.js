import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import { Button } from "@material-ui/core";

import req from "common/actions/socket/req";
import doRefreshReplay from "demiurg/actions/doRefreshReplay";
import showSnackbar from "common/actions/ui/showSnackbar";

const mapDispatchToProps = {
  req,
  showSnackbar
};

class RefreshReplay extends Component {
  constructor(props) {
    super(props);

    this.handleRefreshReplay = this.handleRefreshReplay.bind(this);
  }

  async handleRefreshReplay() {
    const { req, showSnackbar } = this.props;

    try {
      await req(doRefreshReplay());
    } catch (error) {
      showSnackbar(false, `Command error: ${error}`);
    }
  }

  render() {
    return (
      <Button
        classes={{
          root: styles[`refresh-replay`],
          label: styles[`refresh-replay-label`]
        }}
        onClick={this.handleRefreshReplay}
      >
        refresh & replay
      </Button>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(RefreshReplay);
