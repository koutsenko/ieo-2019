import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";

import { TableRow } from "@material-ui/core";

import rowCollapsed from "common/assets/row-collapsed.svg";
import rowExpanded from "common/assets/row-expanded.svg";
import CustomTableCell from "common/ui-kit/CustomTable/Cell";

const space = "\u00A0\u00A0\u00A0";

class CustomTableRow extends Component {
  /**
   * Внутреннее состояние - свернутость.
   */
  state = {
    collapsed: undefined
  };

  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    const { onRowSelect, row, cols } = this.props;
    const value = row[cols.length];

    onRowSelect(value);
  }

  toggleCollapsed = collapsed => () => {
    this.setState({
      collapsed: !this.isCollapsed(collapsed)
    });
  };

  isCollapsed = collapsed => {
    const ic = this.state.collapsed;
    const isCollapsed = ic === undefined ? collapsed : ic;

    return isCollapsed;
  };

  buildCollapseIcon = (level, collapsed) => {
    const isCollapsed = this.isCollapsed(collapsed);

    return (
      <img
        onClick={this.toggleCollapsed(collapsed)}
        src={isCollapsed ? rowCollapsed : rowExpanded}
        className={styles.icon}
        alt={isCollapsed ? "expand" : "collapse"}
        style={{ left: `${level * 16}px` }}
      />
    );
  };

  buildTreeTrunk = level => {
    return level === 0
      ? null
      : [space, ...(level > 1 ? Array(level - 1).fill(space) : [])];
  };

  render() {
    const {
      level,
      row,
      rowIndex,
      keys,
      cols,
      selectedRow,
      onRowSelect
    } = this.props;
    const selectable = row.length === cols.length + 1;
    const selectValue = !selectable ? null : row[cols.length];
    const selected = selectable && selectValue === selectedRow;

    return Array.isArray(row) ? (
      <TableRow
        key={keys[rowIndex]}
        classes={{
          root: cn(styles.row, {
            [styles.selected]: selected,
            [styles.selectable]: selectable
          })
        }}
        {...(selectable && { onClick: this.handleSelect })}
      >
        {cols.map((col, colIndex) => (
          <CustomTableCell key={col} selected={selected}>
            {colIndex === 0 && this.buildTreeTrunk(level)}
            {row[colIndex]}
          </CustomTableCell>
        ))}
      </TableRow>
    ) : (
      [
        <TableRow
          key={keys[rowIndex]}
          classes={{
            root: cn(styles.row, {
              [styles.selected]: selected,
              [styles.selectable]: selectable
            })
          }}
          {...(selectable && { onClick: this.handleSelect })}
        >
          {cols.map((col, colIndex) => (
            <CustomTableCell key={col} selected={selected}>
              {colIndex === 0 && this.buildTreeTrunk(level)}
              {colIndex === 0 && this.buildCollapseIcon(level, row.collapsed)}
              {row.data[colIndex]}
            </CustomTableCell>
          ))}
        </TableRow>,
        ...(this.isCollapsed(row.collapsed)
          ? []
          : row.children
              .filter(r => r !== null)
              .map((child, childIndex) => (
                <CustomTableRow
                  {...{
                    cols,
                    key: row.keys[childIndex],
                    keys: row.keys,
                    level: level + 1,
                    onRowSelect,
                    row: child,
                    rowIndex: childIndex,
                    selectedRow
                  }}
                ></CustomTableRow>
              )))
      ]
    );
  }
}

export default CustomTableRow;
