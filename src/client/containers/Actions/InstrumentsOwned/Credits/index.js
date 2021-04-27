import React, { Component, Fragment } from "react";

import { Tooltip, Typography } from "@material-ui/core";

import { OWNED_CREDITS_TABLE_TITLE } from "common/constants/messages";
import CustomButtonDots from "common/ui-kit/CustomButtonDots";
import CustomMenu from "common/ui-kit/CustomMenu";
import CustomTable from "common/ui-kit/CustomTable";
import { fmt, trimDigits } from "common/utils/money";
import getFullCreditSum from "common/selectors/fullCreditSum";
import CreditRepaymentDialog from "client/components/Dialogs/CreditRepayment";

class OwnedCreditsContainer extends Component {
  state = {
    earlyCreditRepayment: false,
    earlyCreditRepaymentFinancialPropertyId: null,
    menuData: null
  };

  constructor(props) {
    super(props);

    this.closeCreditRepaymentDlg = this.closeCreditRepaymentDlg.bind(this);
  }

  handleEarlyRepayment = financialPropertyId => () => {
    this.setState({
      earlyCreditRepayment: true,
      earlyCreditRepaymentFinancialPropertyId: financialPropertyId
    });
  };

  closeCreditRepaymentDlg = () => {
    this.setState({
      earlyCreditRepayment: false,
      earlyCreditRepaymentFinancialPropertyId: null
    });
  };

  render() {
    const { orderedTurnState } = this.props;
    const {
      menuData,
      earlyCreditRepayment,
      earlyCreditRepaymentFinancialPropertyId
    } = this.state;
    const { names } = orderedTurnState.instruments;

    return (
      <Fragment>
        <Typography>{OWNED_CREDITS_TABLE_TITLE}</Typography>
        <CustomTable
          {...{
            cols: [
              "Name",
              "Interest rate",
              "Years remaining",
              "Debt remaining",
              ""
            ],
            colWidth: ["25%", "20%", "25%", "25%", "5%"],
            data: orderedTurnState.liabilities
              .filter(l => l.type === "credit")
              .map(credit => {
                // copy paste from src\client\containers\State\Liabs\index.js::L155
                const {
                  id,
                  years_remaining,
                  financialPropertyId,
                  principal_remaining,
                  percent
                } = credit;
                const fcs = getFullCreditSum(credit);
                const delta = fcs - principal_remaining;
                const over = fmt(delta);
                const pr = fmt(principal_remaining);
                const debt = `${pr} (${over})`;
                const p = trimDigits(percent);
                const name = id === 0 ? "Mortgage" : names[id].name;

                return [
                  name,
                  p,
                  years_remaining,
                  <Tooltip title="principal (interest)">
                    <span>{debt}</span>
                  </Tooltip>,
                  <CustomButtonDots
                    onClick={event => {
                      const { target } = event;

                      this.setState({
                        menuData: {
                          target,
                          financialPropertyId
                        }
                      });
                    }}
                  />
                ];
              }),
            keys: orderedTurnState.liabilities
              .filter(l => l.type === "credit")
              .map(credit => credit.financialPropertyId)
          }}
        />
        {menuData !== null && (
          <CustomMenu
            {...{
              anchorEl: menuData.target,
              onClose: () => {
                this.setState({ menuData: null });
              },
              open: true,
              menuItems: {
                "Early credit repayment": this.handleEarlyRepayment(
                  menuData.financialPropertyId
                )
              }
            }}
          />
        )}
        {earlyCreditRepayment && (
          <CreditRepaymentDialog
            {...{
              earlyCreditRepaymentFinancialPropertyId,
              onClose: this.closeCreditRepaymentDlg
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default OwnedCreditsContainer;
