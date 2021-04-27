import React, { Component } from "react";
import { connect } from "react-redux";
import nanoid from "nanoid";

import {
  ORDERS_DIALOG_HEADER,
  ORDERS_DIALOG_NO_ORDERS
} from "common/constants/messages";
import {
  SELL,
  BUY,
  PAY_LEVERAGE_BODY,
  TAKE_CREDIT
} from "common/constants/orders";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";

const mapStateToProps = state => ({
  turnState: state.game.turnState
});

class ViewOrdersDialog extends Component {
  render() {
    const { onClose, onRevert, turnState } = this.props;

    return (
      <CustomDialog
        {...{
          title: ORDERS_DIALOG_HEADER,
          content: (
            <div>
              {turnState.orders.length === 0 ? (
                <CustomText>{ORDERS_DIALOG_NO_ORDERS}</CustomText>
              ) : (
                turnState.orders.map((order, index) => {
                  const { action } = order;
                  let result;

                  if ([SELL, BUY].includes(action)) {
                    const { id, action, count } = order;
                    const { name } = turnState.instruments.names[id];
                    const key = `${index}_${id}`;
                    result = (
                      <CustomText key={key}>
                        {action} {name} {count}
                      </CustomText>
                    );
                  } else if (action === PAY_LEVERAGE_BODY) {
                    result = (
                      <CustomText key={nanoid()}>
                        Leverage principal payment
                      </CustomText>
                    );
                  } else if (action === TAKE_CREDIT) {
                    result = (
                      <CustomText key={nanoid()}>Take credit</CustomText>
                    );
                  }

                  return result;
                })
              )}
            </div>
          ),
          actions: {
            Close: onClose,
            "Cancel all orders": () => {
              onRevert();
              onClose();
            }
          }
        }}
      />
    );
  }
}

export default connect(mapStateToProps)(ViewOrdersDialog);
