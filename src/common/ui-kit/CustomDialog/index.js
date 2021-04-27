import styles from "./index.module.css";

import React, { Component } from "react";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Toolbar,
  Typography
} from "@material-ui/core";

import CustomAppBar from "common/ui-kit/CustomAppBar";
import CustomButton from "common/ui-kit/CustomButton";

class CustomDialog extends Component {
  static defaultProps = {
    actions: {}
  };

  render() {
    const { actions, content, title, width } = this.props;

    return (
      <Dialog
        open={true}
        PaperProps={{
          classes: {
            root: styles.dialog
          },
          style: width && { minWidth: width }
        }}
      >
        <CustomAppBar position="relative">
          <Toolbar classes={{ root: styles.toolbar }}>
            <Typography>{title}</Typography>
          </Toolbar>
        </CustomAppBar>
        <DialogContent classes={{ root: styles.dialogContent }}>
          <div className={styles.padding}>{content}</div>
        </DialogContent>
        <DialogActions classes={{ root: styles.dialogActions }}>
          {Object.keys(actions).map(key => (
            <CustomButton key={key} onClick={actions[key]}>
              {key}
            </CustomButton>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

export default CustomDialog;
