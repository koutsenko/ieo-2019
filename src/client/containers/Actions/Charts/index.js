import React from "react";
import { connect } from "react-redux";

import CustomCharts from "common/ui-kit/CustomCharts";
import { trimDigits } from "common/utils/money";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

const ActionsChartsContainer = ({ orderedTurnState, selectedInstrument }) => {
  const { id, range } = selectedInstrument;
  const { gameStartPeriod, historyStartPeriod, instruments } = orderedTurnState;
  const { history, meta, names } = instruments;
  const { type } = meta[id];
  const { name } = names[id];
  const raw_history =
    type === "Credit"
      ? history[id].map(i => ({
          period: i.period,
          cost: trimDigits(i[range].replace("%", ""))
        }))
      : type === "Bond"
      ? history[id].map(i => ({
          period: i.period,
          cost: trimDigits(i["%,dividend"]) // NOTE у бондов %, а у всех остальных фикс. число
        }))
      : history[id].map(i => ({
          period: i.period,
          cost: trimDigits(i.cost)
        }));

  const filtered_history = raw_history.filter(
    h => h.period >= historyStartPeriod
  );
  const shifted_history = filtered_history.map(h => ({
    ...h,
    period: h.period - gameStartPeriod + 1
  }));

  return (
    <CustomCharts
      {...{
        history: shifted_history,
        name
      }}
    />
  );
};

export default connect(mapStateToProps)(ActionsChartsContainer);
