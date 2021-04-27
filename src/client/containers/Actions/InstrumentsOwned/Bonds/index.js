import React, { Component, Fragment } from "react";

import { Typography } from "@material-ui/core";

import { OWNED_BONDS_TABLE_TITLE } from "common/constants/messages";
import CustomTable from "common/ui-kit/CustomTable";

class OwnedBondsContainer extends Component {
  render() {
    const { orderedTurnState } = this.props;
    const { names, meta } = orderedTurnState.instruments;
    const Bond_ids = Object.keys(meta).filter(id => meta[id].type === "Bond");

    return (
      <Fragment>
        <Typography>{OWNED_BONDS_TABLE_TITLE}</Typography>
        <CustomTable
          {...{
            cols: ["Item No.", "Name", ""],
            colWidth: ["10%", "80%", "10%"],
            data: orderedTurnState.assets
              .filter(a => Bond_ids.includes(a.id))
              .map((Bond, index) => {
                const { id, financialPropertyId } = Bond;

                return [index + 1, names[id].name, "", financialPropertyId];
              }),
            keys: orderedTurnState.assets
              .filter(a => Bond_ids.includes(a.id))
              .map(RE => RE.financialPropertyId)
          }}
        />
      </Fragment>
    );
  }
}

export default OwnedBondsContainer;
