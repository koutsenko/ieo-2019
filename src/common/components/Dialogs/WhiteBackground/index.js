import styles from "./index.module.css";

import React, { Component } from "react";

import { Dialog } from "@material-ui/core";

class DialogWbg extends Component {
  render() {
    return (
      <Dialog
        {...{
          ...this.props,
          BackdropProps: {
            classes: { root: styles.root }
          }
        }}
      />
    );
  }
}

export default DialogWbg;
