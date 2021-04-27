import styles from "./index.module.css";

import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import Media from "react-media";

class CustomCharts extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    const { history, name } = props;
    const cost = history.map(h => h.cost);
    const min = 0;
    const max = 2 * Math.max(...cost);

    return {
      options: {
        fill: {
          type: "gradient",
          gradient: {
            colorStops: [
              {
                offset: 0,
                color: "#021D44"
              },
              {
                offset: 100,
                color: "#167385"
              }
            ]
          }
        },
        colors: ["#BFBFBF"],
        grid: {
          show: true,
          borderColor: "#4D5256",
          strokeDashArray: [3, 3],
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        chart: {
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2,
          curve: "straight"
        },
        xaxis: {
          type: "numeric",
          categories: history.map(h => h.period),
          labels: {
            formatter: v => parseInt(v, 10),
            style: {
              colors: "white"
            }
          }
        },
        yaxis: {
          min,
          max,
          opposite: true,
          labels: {
            style: {
              color: "white"
            }
          }
        },
        tooltip: {
          x: {
            formatter: value => `Year ${parseInt(value, 10)}`,
            show: false
          }
        }
      },
      series: [
        {
          name,
          data: history.map(h => h.cost)
        }
      ]
    };
  }

  render() {
    return (
      <div id="chart" className={styles.container}>
        <Media query="(max-height: 768px)">
          {matches =>
            matches ? (
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="area"
                height="180"
              />
            ) : (
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="area"
                height="300"
              />
            )
          }
        </Media>
      </div>
    );
  }
}

export default CustomCharts;
