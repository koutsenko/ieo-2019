import React, { Fragment } from "react";

import getTodayInstrument from "common/selectors/todayInstrument";
import { fmt, fmtDividend } from "common/utils/money";
import costDelta from "common/selectors/costDelta";
import CostWithDelta from "client/components/CostWithDelta";
import CustomButtonDots from "common/ui-kit/CustomButtonDots";
import { RESIDENCE_RENTAL } from "common/constants/residence";

import { Home } from "@material-ui/icons";

const buildREColumnData = ({
  data: { id, orderedTurnState, name, menuHandler }
}) => {
  const { defaultInstrDigits } = orderedTurnState;
  const ins = getTodayInstrument(orderedTurnState, id);

  if (ins === undefined) {
    return null;
  }

  const meta = orderedTurnState.instruments.meta[id];
  const { digits } = meta.static_params;
  const dig = digits !== undefined ? parseInt(digits) : defaultInstrDigits;
  const dividend_value = fmtDividend(ins);

  const data = [
    name,
    <CostWithDelta
      {...{
        cost: ins.cost,
        delta: fmt(costDelta(orderedTurnState, id), dig),
        digits: dig
      }}
    />,
    dividend_value,
    <Fragment>
      <CustomButtonDots onClick={event => menuHandler(event, id)} />
      {/* FIXME если продукт исчез из рынка а я его снимаю - значит не будет виден факт съема */}
      {orderedTurnState.residence.type === RESIDENCE_RENTAL &&
        orderedTurnState.residence.id === id && (
          <Home style={{ margin: "3px" }} />
        )}
    </Fragment>,
    id
  ];

  return data;
};

export default buildREColumnData;
