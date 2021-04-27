import styles from "./index.module.css";

import React, { Component } from "react";

import { Table, TableBody, TableHead, TableRow } from "@material-ui/core";

import CustomTableRow from "common/ui-kit/CustomTable/Row";
import CustomTableCell from "common/ui-kit/CustomTable/Cell";

const minRowCount = 50;

const walkTree = (count, node) => {
  let result = count;

  if (Array.isArray(node)) {
    // почему-то в assets data 1-го экрана приезжает куча null
    const filtered = node.filter(n => n !== null);

    result = filtered.reduce((acc, cur) => {
      // проверка что это объект
      if (cur.children !== undefined) {
        return walkTree(acc + 1, cur.children);
      } else {
        // а это конечный массив?
        return acc + 1;
      }
    }, count);
  }

  return result;
};

class CustomTable extends Component {
  static getDerivedStateFromProps(props, state) {
    let { data, keys } = props;

    if (props.noGrow) {
      return { data, keys };
    }

    const length = walkTree(0, props.data);
    const delta = minRowCount - length;
    if (delta > 0) {
      const dd = Array(delta).fill([String.fromCharCode(160)]);
      const dk = [...Array(delta)].map((_value, index) => `key_${index}`);
      data = [...data, ...dd];
      keys = [...keys, ...dk];
    }

    return { data, keys };
  }

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      keys: []
    };
  }

  render() {
    const { cols, colWidth, selectedRow, onRowSelect } = this.props;
    const { data, keys } = this.state;
    const width =
      colWidth === undefined ? null : (
        <colgroup>
          {colWidth.map((cw, index) => (
            <col key={cols[index]} style={{ width: cw }}></col>
          ))}
        </colgroup>
      );

    return (
      <div className={styles.outer}>
        <div className={styles.container}>
          <Table size="small">
            {width}
            <TableHead>
              <TableRow>
                {cols.map(col => (
                  <CustomTableCell isHead={true} key={col}>
                    {col}
                  </CustomTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .filter(r => r !== null)
                .map((row, rowIndex) => (
                  <CustomTableRow
                    {...{
                      cols,
                      key: keys[rowIndex],
                      keys,
                      level: 0,
                      onRowSelect,
                      row,
                      rowIndex,
                      selectedRow
                    }}
                  />
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default CustomTable;
