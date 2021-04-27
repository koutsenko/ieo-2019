import React, { Component } from "react";

import CustomCharts from "common/ui-kit/CustomCharts";

const costs = [
  8.7,
  8.5,
  8.3,
  8.85,
  8.7,
  8.9,
  8.2,
  8.95,
  8.3,
  8.55,
  8.9,
  8.25,
  8.65,
  8.1,
  9.85,
  8.7,
  8.5,
  8.9,
  8.85,
  8.0,
  8.7,
  8.9,
  8.2,
  8.95,
  8.3,
  8.55,
  8.9,
  8.25,
  8.65,
  8.1
];

const periods = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30"
];

const history = periods.map((period, index) => ({
  period,
  cost: costs[index]
}));

class UIKitChartsDemo extends Component {
  render() {
    return <CustomCharts {...{ history }} />;
  }
}

export default UIKitChartsDemo;
