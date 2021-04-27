import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";

import doOrder from "client/actions/order";
import { EARLY_REPAYMENT } from "common/constants/orders";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomInputMoney from "common/ui-kit/CustomInput/Money";
import CustomLabel from "common/ui-kit/CustomLabel";
import CustomText from "common/ui-kit/CustomText";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import loadTurn from "client/actions/loadTurn";
import { validMoney, fmt } from "common/utils/money";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

const mapDispatchToProps = {
  req,
  loadTurn,
  showSnackbar
};

class CreditRepaymentDialog extends Component {
  state = {
    error: false,
    earlyCreditRepaymentSum: 0
  };

  render() {
    const {
      onClose,
      orderedTurnState,
      earlyCreditRepaymentFinancialPropertyId,
      req,
      showSnackbar,
      loadTurn
    } = this.props;
    const { error, earlyCreditRepaymentSum } = this.state;
    const credit = orderedTurnState.liabilities.find(
      l => l.financialPropertyId === earlyCreditRepaymentFinancialPropertyId
    );

    // Case if credit was already full-closed via the sell button
    // FIXME Переделать логику.
    if (!credit) {
      return null;
    }

    const { principal_remaining } = credit;

    return (
      <CustomDialog
        {...{
          title: "Early credit repayment",
          content: (
            <div className={styles.content}>
              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <CustomLabel>Remaining debt</CustomLabel>
                </Grid>
                <Grid item xs={7}>
                  <CustomText>{fmt(principal_remaining)}</CustomText>
                </Grid>
                <Grid item xs={5}>
                  <CustomLabel>Enter amount</CustomLabel>
                </Grid>
                <Grid item xs={7}>
                  <CustomInputMoney
                    error={error}
                    onChange={value => {
                      this.setState({
                        earlyCreditRepaymentSum: value,
                        error: !validMoney(value)
                      });
                    }}
                    value={earlyCreditRepaymentSum}
                  />
                </Grid>
              </Grid>
            </div>
          ),
          actions: {
            Pay: async () => {
              const action = EARLY_REPAYMENT;
              const financialPropertyId = earlyCreditRepaymentFinancialPropertyId;
              const sum = parseFloat(earlyCreditRepaymentSum);
              const order = doOrder({ action, financialPropertyId, sum });

              if (error) {
                showSnackbar(false, "Wrong sum");
                return;
              }

              try {
                loadTurn(await req(order));
                showSnackbar(true, "Action successful");
              } catch (error) {
                showSnackbar(false, `Action error: ${error}`);
              }
              // TODO сделать закрытие окна только после успешной оплаты

              onClose();
            },
            Cancel: () => {
              onClose();
            }
          }
        }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditRepaymentDialog);
