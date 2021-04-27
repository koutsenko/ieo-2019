import React, { Fragment } from "react";

import { Typography } from "@material-ui/core";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

import { fmt } from "common/utils/money";

const CostWithDelta = ({ cost, delta, digits, omitDelta, type }) => {
  if (Number.isNaN(cost)) {
    return null;
  }

  const fDelta = parseFloat(delta);
  const formattedCost = fmt(cost, digits);

  /**
   * Type=2 это быстрохак на криводизайн.
   */
  return type === 2 ? (
    <Typography>
      {delta === null || [null, 0].includes(fDelta) ? (
        <span>{formattedCost}</span>
      ) : fDelta > 0 ? (
        <Fragment>
          <span style={{ color: "green" }}>
            {formattedCost} {!omitDelta && `(+${fDelta})`}
            (<ArrowUpward />)
          </span>
        </Fragment>
      ) : fDelta < 0 ? (
        <Fragment>
          <span style={{ color: "red" }}>
            {formattedCost} {!omitDelta && `(${fDelta})`}
            (<ArrowDownward />)
          </span>
        </Fragment>
      ) : null}
    </Typography>
  ) : (
    <Typography>
      {delta === null || [null, 0].includes(fDelta) ? (
        <span style={{ marginLeft: "19px" }}>{formattedCost}</span>
      ) : fDelta > 0 ? (
        <Fragment>
          <ArrowUpward style={{ color: "green", marginRight: "5px" }} />

          <span style={{ color: "green" }}>
            {formattedCost} {!omitDelta && `(+${fDelta})`}
          </span>
        </Fragment>
      ) : fDelta < 0 ? (
        <Fragment>
          <ArrowDownward style={{ color: "red", marginRight: "5px" }} />
          <span style={{ color: "red" }}>
            {formattedCost} {!omitDelta && `(${fDelta})`}
          </span>
        </Fragment>
      ) : null}
    </Typography>
  );
};

export default CostWithDelta;
