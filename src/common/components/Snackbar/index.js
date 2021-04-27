import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import { Snackbar } from "@material-ui/core";

import hideSnackbar from "common/actions/ui/hideSnackbar";

const mapStateToProps = state => ({
  snackbar: state.ui.snackbar
});

const mapDispatchToProps = {
  hideSnackbar
};

class SnackbarComponent extends Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    const { hideSnackbar } = this.props;

    hideSnackbar();
  }

  render() {
    const { snackbar } = this.props;
    const message = snackbar === null ? null : snackbar.message;
    const success = snackbar === null ? null : snackbar.success;

    return (
      <Snackbar
        autoHideDuration={3000}
        ContentProps={{
          classes: {
            root: {
              true: styles.success,
              false: styles.error
            }[success]
          }
        }}
        open={snackbar !== null}
        onClose={this.handleClose}
        message={message}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackbarComponent);
