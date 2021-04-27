import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";

import { TableCell } from "@material-ui/core";

class CustomTableCell extends Component {
  render() {
    const { isHead, children, selected } = this.props;

    return (
      <TableCell
        className={cn(styles.cell, {
          [styles.head]: isHead,
          [styles.selected]: selected
        })}
        padding="none"
      >
        <div className={styles.cellContent}>{children}</div>
      </TableCell>
    );
  }
}

export default CustomTableCell;
