import styles from "./index.module.css";

import React, { Component, Fragment } from "react";

import { Grid, Typography } from "@material-ui/core";

import UIKitChartsDemo from "admin/containers/UIKitDemo/Charts";
import UIKitControlsDemo from "admin/containers/UIKitDemo/Controls";
import UIKitTableDemo from "admin/containers/UIKitDemo/Table";
import UIKitWidgetFormDemo from "admin/containers/UIKitDemo/WidgetForm";
import UIKitAppBarDemo from "admin/containers/UIKitDemo/AppBar";
import UIKitDialogDemo from "admin/containers/UIKitDemo/Dialog";

class UIKitDemo extends Component {
  buildLeftColumn() {
    return (
      <Fragment>
        <div className={styles.row}>
          <div className={styles.desc}>
            <Typography variant="h6">Various controls</Typography>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.demo}>
            <UIKitControlsDemo />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.desc}>
            <Typography variant="h6">App Bar with buttons</Typography>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.demo}>
            <UIKitAppBarDemo />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.desc}>
            <Typography variant="h6">
              Scrollable table with fixed headers and expandable tree
            </Typography>
            <Typography variant="h6">
              You choose which rows can be selected by passing extra-data value
            </Typography>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.demo}>
            <UIKitTableDemo />
          </div>
        </div>
      </Fragment>
    );
  }

  buildRightColumn() {
    return (
      <Fragment>
        <div className={styles.row}>
          <div className={styles.desc}>
            <Typography variant="h6">
              Order widget (buy, take credit or buy RE).
            </Typography>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.demo}>
            <UIKitWidgetFormDemo />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.desc}>
            <Typography variant="h6">
              Charts demo based on react-apexcharts library
            </Typography>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.demo}>
            <UIKitChartsDemo />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.desc}>
            <Typography variant="h6">Dialogs demo</Typography>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.demo}>
            <UIKitDialogDemo />
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          {this.buildLeftColumn()}
        </Grid>
        <Grid item xs={6}>
          {this.buildRightColumn()}
        </Grid>
      </Grid>
    );
  }
}

export default UIKitDemo;
