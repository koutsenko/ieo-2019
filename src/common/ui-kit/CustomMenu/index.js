/**
 * Custom context menu
 */

import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";

import { Menu } from "@material-ui/core";

import CustomMenuItem from "common/ui-kit/CustomMenu/Item";

class CustomMenu extends Component {
  render() {
    const { classes = {}, menuItems, ...props } = this.props;
    const { children, onClose } = props;

    return (
      <Menu
        {...{
          ...props,
          classes: { ...classes, paper: cn(classes.menu, styles.menu) }
        }}
      >
        {Object.keys(menuItems).map(key => (
          <CustomMenuItem
            key={key}
            onClick={() => {
              onClose();
              menuItems[key]();
            }}
          >
            {key}
          </CustomMenuItem>
        ))}
        {children}
      </Menu>
    );
  }
}

export default CustomMenu;
