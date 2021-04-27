import styles from "./index.module.css";

import React, { Component } from "react";

import CustomButtonDots from "common/ui-kit/CustomButtonDots";
import CustomTable from "common/ui-kit/CustomTable";
import CustomMenu from "common/ui-kit/CustomMenu";
import CustomMenuItem from "common/ui-kit/CustomMenu/Item";

class UIKitTableDemo extends Component {
  state = {
    tableMenuOpened: false,
    selectedRow: "sel-data1"
    // selectedRow: null /* значение в "лишнией" ячейке (т.е. в выделяемой строке) */
  };

  constructor(props) {
    super(props);

    this.onMenuClose = this.onMenuClose.bind(this);
    this.onMenuOpen = this.onMenuOpen.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);

    this.tableMenuRef = React.createRef();
  }

  onMenuOpen() {
    this.setState({ tableMenuOpened: true });
  }

  onMenuClose() {
    this.setState({ tableMenuOpened: false });
  }

  onRowSelect(selectedRow) {
    this.setState({ selectedRow });
  }

  buildTableData() {
    const { selectedRow } = this.state;
    const { onRowSelect } = this;

    return {
      selectedRow,
      onRowSelect,
      colWidth: ["30%", "20%", "20%", "20%", "10%"],
      cols: ["name", "cost", "count", "sum", ""],
      keys: [
        "k0",
        "k1",
        "k2",
        "k3",
        "k4",
        "k5",
        "k6",
        "k7",
        "k8",
        "k9",
        "kA",
        "kB"
      ],
      data: [
        {
          children: [
            [
              "SELECT ME - 1",
              "$ 1.00",
              "3",
              "$ 3.00",
              <CustomButtonDots
                parentRef={this.tableMenuRef}
                onClick={this.onMenuOpen}
              />,
              "sel-data1"
            ],
            ["SELECT ME - 2", "$ 4.00", "2", "$ 8.00", null, "sel-data2"],
            {
              data: ["Heading", "$ 4.00", "2", "$ 8.00"],
              children: [
                ["testM", "$ 1.00", "3", "$ 3.00"],
                ["testN", "$ 4.00", "2", "$ 8.00"]
              ],
              keys: ["xz", "xz1"]
            },
            ["test2", "$ 1.00", "3", "$ 3.00"],
            ["test3", "$ 4.00", "2", "$ 8.00"]
          ],
          data: ["Heading", "$ 4.00", "2", "$ 8.00"],
          keys: ["kC", "kD", "kk", "ss", "xx"]
        },
        ["test2", "$ 1.00", "3", "$ 3.00"],
        ["test3", "$ 4.00", "2", "$ 8.00"],
        ["test4", "$ 4.00", "2", "$ 8.00"],
        ["test5", "$ 4.00", "2", "$ 8.00"],
        ["test6", "$ 4.00", "2", "$ 8.00"],
        ["test7", "$ 4.00", "2", "$ 8.00"],
        ["test8", "$ 4.00", "2", "$ 8.00"],
        ["test9", "$ 4.00", "2", "$ 8.00"],
        ["test0", "$ 4.00", "2", "$ 8.00"],
        ["testX", "$ 4.00", "2", "$ 8.00"],
        ["testY", "$ 4.00", "2", "$ 8.00"]
      ]
    };
  }

  render() {
    const { tableMenuOpened } = this.state;

    return (
      <div className={styles["table-container"]}>
        <CustomTable {...this.buildTableData()} />
        {tableMenuOpened && (
          <CustomMenu
            anchorEl={this.tableMenuRef.current}
            onClose={this.onMenuClose}
            open={true}
            menuItems={{
              "(via menuItems) Pay for one": () => {
                console.log("pay for one");
              },
              "(via menuItems) Pay for two": () => {
                console.log("pay for two");
              }
            }}
          >
            <CustomMenuItem onClick={this.onMenuClose}>
              (via children) Smth else
            </CustomMenuItem>
          </CustomMenu>
        )}
      </div>
    );
  }
}

export default UIKitTableDemo;
