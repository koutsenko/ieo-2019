import React, { Component } from "react";

import CustomTable from "common/ui-kit/CustomTable";
import CustomText from "common/ui-kit/CustomText";
import getInstrumentByDay from "common/selectors/chosenDayInstrument";
import getTodayInstrument from "common/selectors/todayInstrument";
import CustomDialog from "common/ui-kit/CustomDialog";

class MarginCallDialog extends Component {
  transformData = mcdata => {
    const { turnState } = this.props;
    const result = mcdata.map(order => {
      const { count, id, financialPropertyId } = order;
      const { assets, instruments } = turnState;
      const { meta, names } = instruments;
      const { name } = names[id];
      const { type } = meta[id];
      const a = assets.find(a => a.financialPropertyId === financialPropertyId);

      if (a === undefined) {
        return [name, count, "?"];
      }

      const { start_turn } = a;
      const cost =
        type === "Bond"
          ? getInstrumentByDay(turnState, id, start_turn)
          : getTodayInstrument(turnState, id);

      return [name, count, cost];
    });

    return result;
  };

  render() {
    const { turnState, onClose } = this.props;

    return (
      <CustomDialog
        {...{
          title: "Margin call",
          content: (
            <div>
              <CustomText>The following items are sold:</CustomText>
              <CustomTable
                {...{
                  cols: ["Name", "Quantity", "Cost"],
                  data: this.transformData(turnState.margin_call_last_data),
                  keys: turnState.margin_call_last_data.map(
                    ({ financialPropertyId }) => financialPropertyId
                  )
                }}
              />
            </div>
          ),
          actions: {
            Close: onClose
          }
        }}
      />
    );
  }
}

export default MarginCallDialog;
