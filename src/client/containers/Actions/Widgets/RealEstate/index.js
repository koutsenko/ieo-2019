import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";

import doOrder from "client/actions/order";
import loadTurn from "client/actions/loadTurn";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import getTodayInstrument from "common/selectors/todayInstrument";
import CustomButton from "common/ui-kit/CustomButton";
import CustomLabel from "common/ui-kit/CustomLabel";
import CustomSelect from "common/ui-kit/CustomSelect";
import CustomText from "common/ui-kit/CustomText";
import { BUY } from "common/constants/orders";
import { fmt, validMoney } from "common/utils/money";
import CustomInputMoney from "common/ui-kit/CustomInput/Money";
import CreditScheduleDialog from "client/components/Dialogs/CreditSchedule";
import getFullCreditSum from "common/selectors/fullCreditSum";
import buildCredit from "common/calc/buildCredit";

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

const mdpValidator = (re_mdp, money, re_price, RE_min_dp_percents) => {
  const result =
    !validMoney(re_mdp, true) ||
    re_mdp > money ||
    re_mdp < (re_price * RE_min_dp_percents) / 100;

  return result;
};

class RealEstateWidget extends Component {
  static getDerivedStateFromProps(props, state) {
    const { selectedInstrument, orderedTurnState } = props;
    const { currentMortgageLoanCost } = orderedTurnState;
    const instrument = getTodayInstrument(
      orderedTurnState,
      selectedInstrument.id
    );
    const { cost } = instrument;
    const {
      RE_new_markup_percents,
      RE_old_discount_percents,
      RE_min_dp_percents
    } = orderedTurnState;

    const cost_new = (cost * (100 + RE_new_markup_percents)) / 100;
    const cost_old = (cost * (100 - RE_old_discount_percents)) / 100;
    const re_price = {
      new: cost_new,
      normal: cost,
      old: cost_old
    }[state.re_condition];
    const re_mdp_error = mdpValidator(
      state.re_mdp,
      orderedTurnState.money,
      re_price,
      RE_min_dp_percents
    );
    let re_overpayment;
    if (re_mdp_error || state.re_m_years === 0) {
      re_overpayment = "-";
    } else {
      const re_principal = re_price - state.re_mdp;
      const re_credit = buildCredit(
        0,
        "credit",
        re_principal,
        state.re_m_years,
        `${currentMortgageLoanCost}`,
        null
      );
      const re_fcs = getFullCreditSum(re_credit);
      re_overpayment = re_fcs - re_principal;
    }

    return {
      re_price,
      re_overpayment,
      re_mdp_error
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      re_condition: "normal",
      re_mdp: 0,
      re_mdp_error: false,
      re_m_years: 0,
      re_price: null,
      re_overpayment: null,
      re_schedule_dialog: false
    };

    this.handleBuy = this.handleBuy.bind(this);
    this.handleMdpEdit = this.handleMdpEdit.bind(this);
    this.handleYearsChange = this.handleYearsChange.bind(this);
  }

  componentDidMount() {
    const { orderedTurnState } = this.props;
    const { re_price } = this.state;
    const { RE_min_dp_percents } = orderedTurnState;
    const re_mdp = (re_price * RE_min_dp_percents) / 100;

    this.setState({ re_mdp });
  }

  handleMdpEdit = re_mdp => {
    this.setState({ re_mdp });
  };

  handleYearsChange = event => {
    const re_m_years = event.target.value;

    this.setState({ re_m_years });
  };

  toggleSchedule = re_schedule_dialog => () => {
    this.setState({ re_schedule_dialog });
  };

  handleBuy = async withCredit => {
    const { req, showSnackbar, loadTurn, selectedInstrument } = this.props;
    const { re_condition, re_mdp, re_m_years } = this.state;
    const mortgageData = { re_mdp, re_m_years };
    const action = BUY;
    const count = 1;

    const { id } = selectedInstrument;
    const order = doOrder({
      ...{
        action,
        count,
        id,
        re_condition
      },
      ...(withCredit && { mortgageData })
    });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Order successful");
    } catch (error) {
      showSnackbar(false, `Order error: ${error}`);
    }
  };

  render() {
    const { orderedTurnState } = this.props;
    const { currentMortgageLoanCost } = orderedTurnState;
    const {
      re_price,
      re_condition,
      re_mdp,
      re_mdp_error,
      re_overpayment,
      re_m_years,
      re_schedule_dialog
    } = this.state;
    const principal = re_price - re_mdp;
    const withCredit = re_m_years > 0;

    return (
      <Fragment>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <CustomLabel>Real estate condition</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomSelect
              value={re_condition}
              handleChange={event => {
                const { orderedTurnState, selectedInstrument } = this.props;
                const {
                  RE_min_dp_percents,
                  RE_new_markup_percents,
                  RE_old_discount_percents
                } = orderedTurnState;
                const re_condition = event.target.value;
                const instrument = getTodayInstrument(
                  orderedTurnState,
                  selectedInstrument.id
                );
                const { cost } = instrument;
                const cost_new = (cost * (100 + RE_new_markup_percents)) / 100;
                const cost_old =
                  (cost * (100 - RE_old_discount_percents)) / 100;
                const re_price = {
                  new: cost_new,
                  normal: cost,
                  old: cost_old
                }[re_condition];
                const re_mdp = (re_price * RE_min_dp_percents) / 100;

                this.setState({ re_condition, re_mdp });
              }}
              values={["new", "normal", "old"]}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomLabel>Price</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomText>{fmt(re_price)}</CustomText>
          </Grid>
          <Grid item xs={5}>
            <CustomLabel>Mortgage Down Payment</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomInputMoney
              error={re_mdp_error}
              onChange={this.handleMdpEdit}
              value={re_mdp}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomLabel>Mortgage Sum</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomText>{fmt(principal)}</CustomText>
          </Grid>
          <Grid item xs={5}>
            <CustomLabel>
              Mortgage Years (rate {currentMortgageLoanCost}%)
            </CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomSelect
              value={re_m_years}
              handleChange={this.handleYearsChange}
              values={[...Array(30).keys()].map(x => x++)}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomLabel>Overpayment</CustomLabel>
          </Grid>
          <Grid item xs={2}>
            <CustomText>
              {re_overpayment === "-" ? "-" : fmt(re_overpayment)}
            </CustomText>
          </Grid>
          <Grid item xs={8} align="right">
            <CustomButton
              disabled={!withCredit || re_mdp_error}
              onClick={this.toggleSchedule(true)}
            >
              Credit details
            </CustomButton>
          </Grid>
          <Grid item xs={4}>
            <CustomButton
              disabled={re_mdp_error}
              onClick={() => this.handleBuy(withCredit)}
            >
              Buy
            </CustomButton>
          </Grid>
        </Grid>
        {re_schedule_dialog && (
          <CreditScheduleDialog
            id={0}
            onClose={this.toggleSchedule(false)}
            percent={`${currentMortgageLoanCost}`}
            principal={principal}
            orderedTurnState={orderedTurnState}
            years={re_m_years}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealEstateWidget);
