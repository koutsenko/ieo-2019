import React, { Component } from "react";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";

class PossibleBankruptcyDialog extends Component {
  constructor(props) {
    super(props);

    this.handleBankruptcyCheck = this.handleBankruptcyCheck.bind(this);
    this.handleTryToPayDebts = this.handleTryToPayDebts.bind(this);
  }

  handleBankruptcyCheck() {
    const { onForceTurn } = this.props;

    onForceTurn();
  }

  handleTryToPayDebts() {
    const { onClose } = this.props;

    onClose();
  }

  render() {
    return (
      <CustomDialog
        {...{
          actions: {
            "Check me for a bankruptcy": this.handleBankruptcyCheck,
            "Try to pay the debts in current turn": this.handleTryToPayDebts
          },
          content: (
            <div>
              <CustomText>You have negative balance</CustomText>
              <CustomText>Please take an decision:</CustomText>
            </div>
          ),
          title: "Negative balance"
        }}
      />
    );
  }
}

export default PossibleBankruptcyDialog;
