import React from "react";
import _ from "lodash";
import C3Chart from "react-c3js";

const Chart = ({ name, values, color, limit = 50 }) => {
  return values.length > 0 ? (
    <C3Chart
      style={{ height: "100%" }}
      padding={{
        bottom: -10,
        left: -1,
        right: -1
      }}
      data={{
        names: {
          data1: name
        },
        columns: [["data1", ..._.takeRight(values, limit || 50)]],
        type: "area"
      }}
      legend={{
        show: false
      }}
      transition={{
        duration: 0
      }}
      point={{
        show: false
      }}
      tooltip={{
        format: {
          title: function(x) {
            return "";
          }
        }
      }}
      axis={{
        y: {
          padding: {
            bottom: 0
          },
          show: false,
          tick: {
            outer: false
          }
        },
        x: {
          padding: {
            left: 0,
            right: 0
          },
          show: false
        }
      }}
      color={{
        pattern: [color]
      }}
    />
  ) : null;
};

export default Chart;
