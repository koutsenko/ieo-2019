import styles from "./index.module.css";

import React, { Component } from "react";

import { Tab, Tabs } from "@material-ui/core";

class InstrumentGroupsTabbar extends Component {
  render() {
    const { activeGroup, setActiveGroup } = this.props;

    return (
      <Tabs
        classes={{
          flexContainer: styles["tabs-flexContainer"],
          indicator: styles.indicator
        }}
        onChange={setActiveGroup}
        value={activeGroup}
      >
        {[
          "Stocks",
          "Bonds",
          "Indexes",
          "Commodities",
          "ETF & MF",
          "Other",
          "Real estate",
          "Credits"
        ].map(label => (
          <Tab
            classes={{ root: styles.tabbutton, selected: styles.selected }}
            key={label}
            label={label}
          />
        ))}
      </Tabs>
    );
  }
}

export default InstrumentGroupsTabbar;
