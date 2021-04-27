import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";

import doOrder from "client/actions/order";
import loadTurn from "client/actions/loadTurn";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import { VIEW_SCHEDULE_BUTTON_TEXT } from "common/constants/messages";
import CustomButton from "common/ui-kit/CustomButton";
import CustomLabel from "common/ui-kit/CustomLabel";
import CreditScheduleDialog from "client/components/Dialogs/CreditSchedule";
import getTodayInstrument from "common/selectors/todayInstrument";
import CustomInput from "common/ui-kit/CustomInput";
import CustomInputMoney from "common/ui-kit/CustomInput/Money";
import { TAKE_CREDIT } from "common/constants/orders";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

class TakeCreditWidget extends Component {
  state = {
    viewSchedule: false,
    principal: null,
    principalValid: true,
    years: null,
    yearsValid: true
  };

  constructor(props) {
    super(props);

    this.handleEnter = this.handleEnter.bind(this);
  }

  handleTake = async () => {
    const action = TAKE_CREDIT;
    const { req, showSnackbar, loadTurn, selectedInstrument } = this.props;
    const { principal, years } = this.state;
    const sum = parseFloat(principal);
    const { id } = selectedInstrument;
    const order = doOrder({ action, id, sum, years: parseInt(years, 10) });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Order successful");
    } catch (error) {
      showSnackbar(false, `Order error: ${error}`);
    }
  };

  handleSumInput = value => {
    const fValue = parseFloat(value);
    const isPositiveFloat = fValue > 0 && fValue.toString() === value;

    this.setState({
      principal: value,
      principalValid: isPositiveFloat
    });
  };

  handlYearsInput = event => {
    const { selectedInstrument } = this.props;
    const { value } = event.target;
    const iValue = parseInt(value, 10);
    // https://stackoverflow.com/a/16799538
    const isNatural = iValue > 0 && iValue.toString() === value;
    const { range } = selectedInstrument;
    const realRange = range.split(" ")[0].split("-"); // 1-3 years	4-7 years	8-12 years

    this.setState({
      years: value,
      yearsValid:
        parseInt(value) >= realRange[0] &&
        parseInt(value) <= realRange[1] &&
        isNatural
    });
  };

  handleEnter = async e => {
    const { principalValid, yearsValid } = this.state;

    if (yearsValid && principalValid && e.key === "Enter") {
      await this.handleTake();
    }
  };

  render() {
    const { selectedInstrument, orderedTurnState } = this.props;
    const { viewSchedule } = this.state;
    const { principal, principalValid, years, yearsValid } = this.state;

    const { id } = selectedInstrument;
    let key;
    if (years >= 1 && years <= 3) {
      key = "1-3 years";
    } else if (years >= 4 && years <= 7) {
      key = "4-7 years";
    } else if (years) {
      key = "8-12 years";
    }
    const instrument = getTodayInstrument(orderedTurnState, id);
    const percent = instrument[key];

    return (
      <Fragment>
        <Grid alignItems="baseline" container spacing={1}>
          <Grid item xs={2}>
            <CustomLabel>Sum</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomInputMoney
              error={!principalValid}
              onChange={this.handleSumInput}
              onKeyPress={this.handleCreditKeyInput}
              value={principal}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomLabel>Years</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomInput
              error={!yearsValid}
              onChange={this.handlYearsInput}
              onKeyPress={this.handleEnter}
              value={years || ""}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomButton
              disabled={!yearsValid || !principalValid}
              onClick={() => {
                if (
                  principal === null ||
                  principal.trim() === "" ||
                  years === null ||
                  years.trim() === ""
                ) {
                  return;
                }

                this.setState({ viewSchedule: true });
              }}
            >
              {VIEW_SCHEDULE_BUTTON_TEXT}
            </CustomButton>
          </Grid>
          <Grid item xs={2}>
            <CustomButton
              disabled={!yearsValid || !principalValid}
              onClick={this.handleTake}
            >
              Take
            </CustomButton>
          </Grid>
        </Grid>

        {viewSchedule && (
          <CreditScheduleDialog
            id={selectedInstrument.id}
            onClose={() => {
              this.setState({ viewSchedule: false });
            }}
            percent={percent}
            principal={parseFloat(principal)}
            orderedTurnState={orderedTurnState}
            years={parseInt(years, 10)}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakeCreditWidget);
