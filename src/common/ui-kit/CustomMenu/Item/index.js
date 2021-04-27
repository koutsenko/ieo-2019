/**
 * Custom context menu item
 */

import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";

import { MenuItem } from "@material-ui/core";

class CustomMenuItem extends Component {
  render() {
    const { classes = {}, ...props } = this.props;

    return (
      <MenuItem
        {...{
          ...props,
          classes: {
            ...classes,
            root: cn(classes.root, styles["menu-item"]),
            selected: cn(classes.selected, styles["menu-item-selected"])
          }
        }}
      />
    );
  }
}

export default CustomMenuItem;
