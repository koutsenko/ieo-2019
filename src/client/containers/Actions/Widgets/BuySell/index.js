import styles from "./index.module.css";

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";

import doOrder from "client/actions/order";
import loadTurn from "client/actions/loadTurn";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import getTodayInstrument from "common/selectors/todayInstrument";
import CustomInputMoney from "common/ui-kit/CustomInput/Money";
import CustomLabel from "common/ui-kit/CustomLabel";
import CustomButton from "common/ui-kit/CustomButton";
import {
  isFloat,
  trimDigits,
  unformatMoney,
  fmt,
  validMoney
} from "common/utils/money";
import CustomText from "common/ui-kit/CustomText";
import CustomInput from "common/ui-kit/CustomInput";
import { SELL, BUY } from "common/constants/orders";
import { NON_DISCRETE_INSTRUMENTS } from "common/constants/other";
import getAvailableLeverage from "common/calc/getAvailableLeverage";

const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value); // https://stackoverflow.com/a/1830632

const validButDiscrete = value => {
  const isValidMoney = validMoney(value);
  const isF = isFloat(value);
  const result = isValidMoney && isF;

  return result;
};

const validPositive = raw => {
  const isN = isNumber(raw);
  const value = parseFloat(raw);
  const result = isN && value >= 0;

  return result;
};

const mapStateToProps = state => ({
  leverage: state.uiclient.leverage,
  orderedTurnState: state.game.orderedTurnState
});

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

class BuySellWidget extends Component {
  autofixTimeout = null;

  state = {
    count: null,
    countValid: true,
    total: null,
    totalValid: true
  };

  /**
   * На одну строку упакоовали данные по плечу и по мин. необх. размеру покупки.
   */
  buildDetails = (leverage, minQTY) => {
    const { selectedInstrument, orderedTurnState } = this.props;
    const { currentLeverageCreditCost } = orderedTurnState;
    const { meta } = orderedTurnState.instruments;
    const { static_params } = meta[selectedInstrument.id];
    const { sh, digits } = static_params;
    const dig =
      digits !== undefined
        ? parseInt(digits)
        : orderedTurnState.defaultInstrDigits;

    const availableLeverageText = `(av.: ${fmt(
      getAvailableLeverage(orderedTurnState, selectedInstrument.id),
      dig
    )})`;
    const leverageText = leverage ? (
      <span className={styles.danger}>
        Leverage {sh}, interest {currentLeverageCreditCost}%{" "}
        {availableLeverageText}.
      </span>
    ) : (
      <span>Leverage disabled.</span>
    );

    const minText = minQTY ? (
      <span>Min. buy {minQTY} pcs.</span>
    ) : (
      <span>No min. buy limit.</span>
    );

    return (
      <div className={styles.row}>
        <CustomText>
          {minText} {leverageText}
        </CustomText>
      </div>
    );
  };

  roundQty = () => {
    const { selectedInstrument, orderedTurnState } = this.props;
    const { count } = this.state;
    const instrument = getTodayInstrument(
      orderedTurnState,
      selectedInstrument.id
    );
    const cost = parseFloat(instrument.cost);
    const roundedCount = Math.floor(count);
    const fixedTotal = trimDigits(roundedCount * cost, 4);

    this.setState({
      count: roundedCount,
      total: fixedTotal
    });
  };

  handleCountInput = event => {
    clearTimeout(this.autofixTimeout);
    const { orderedTurnState, selectedInstrument } = this.props;
    const instrument = getTodayInstrument(
      orderedTurnState,
      selectedInstrument.id
    );
    const cost = parseFloat(instrument.cost);
    const { value } = event.target;

    let total = null;
    let totalValid;
    let count = null;
    const countValid = validPositive(value);

    if (value !== "") {
      if (countValid) {
        count = value;
        total = trimDigits(cost * parseFloat(value), 4);
        totalValid = true;
      } else {
        count = 0;
      }
    }

    this.setState({
      count,
      countValid,
      total,
      totalValid
    });

    const { type } = orderedTurnState.instruments.meta[selectedInstrument.id];
    if (!NON_DISCRETE_INSTRUMENTS.includes(type) && validButDiscrete(value)) {
      this.autofixTimeout = setTimeout(this.roundQty, 3000);
    }
  };

  handleTotalInput = raw => {
    clearTimeout(this.autofixTimeout);
    const { orderedTurnState, selectedInstrument } = this.props;
    const instrument = getTodayInstrument(
      orderedTurnState,
      selectedInstrument.id
    );
    const cost = parseFloat(instrument.cost);

    let count = null;
    let countValid;
    let total = null;
    const totalValid = validMoney(unformatMoney(raw));

    if (raw !== "") {
      if (totalValid) {
        total = parseFloat(unformatMoney(raw));
        count = trimDigits(total / cost, 4);
        countValid = true;
      } else {
        total = unformatMoney(raw);
      }
    }

    this.setState({
      count,
      countValid,
      total,
      totalValid
    });

    const { type } = orderedTurnState.instruments.meta[selectedInstrument.id];
    if (!NON_DISCRETE_INSTRUMENTS.includes(type) && validButDiscrete(count)) {
      this.autofixTimeout = setTimeout(this.roundQty, 3000);
    }
  };

  handleBuy = async event => {
    const { leverage } = this.props;

    await this.doAction(BUY, leverage);
  };

  handleSell = async event => {
    await this.doAction(SELL);
  };

  doAction = async (action, useLeverage) => {
    const {
      req,
      showSnackbar,
      loadTurn,
      selectedInstrument,
      orderedTurnState
    } = this.props;
    const { count } = this.state;

    let financialPropertyId;
    if (action === SELL) {
      // Продается имущество игрока у которого есть financialPropertyId
      const { type } = orderedTurnState.instruments.meta[selectedInstrument.id];
      if (type === "Bond") {
        // Здесь нам неизвестно сколько каких бондов в какой период было куплено.
        // Технически надо начиная с самых новых закрывать, но это надо аккуратно писать код.
        // И возможно тут будет разбивка на несколько заказов.
        showSnackbar(
          false,
          `Order error: you can sell bonds only on "State" screen`
        );
        return;
      } else {
        // FIXME продажа недвижки тоже видимо отдельный кейс, нужен свитч как для бондов
        // Для запросов на продажу добавляем financialPropertyId
        const property = orderedTurnState.assets.find(
          a => a.id === selectedInstrument.id
        );
        if (!property) {
          showSnackbar(false, `Order error: you don't own that instrument`);
          return;
        }

        financialPropertyId = property.financialPropertyId;
      }
    }

    const { id } = selectedInstrument;
    const order = doOrder({
      action,
      id,
      financialPropertyId,
      count,
      useLeverage
    });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Order successful");
    } catch (error) {
      showSnackbar(false, `Order error: ${error}`);
    }
  };

  render() {
    const { selectedInstrument, leverage, orderedTurnState } = this.props;
    const { count, countValid, total, totalValid } = this.state;
    const { minQTY } = orderedTurnState.instruments.meta[
      selectedInstrument.id
    ].static_params;

    return (
      <Fragment>
        {this.buildDetails(leverage, minQTY)}
        <div className={styles.row}>
          <Grid alignItems="baseline" container spacing={1}>
            <Grid item xs={2}>
              <CustomLabel>Count</CustomLabel>
            </Grid>
            <Grid item xs={2}>
              <CustomInput
                error={!countValid}
                value={count || ""}
                onChange={this.handleCountInput}
                onKeyPress={e => {
                  if (countValid && totalValid && e.key === "Enter") {
                    this.handleBuy();
                  }
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomLabel>Total</CustomLabel>
            </Grid>
            <Grid item xs={2}>
              <CustomInputMoney
                onKeyPress={e => {
                  if (totalValid && countValid && e.key === "Enter") {
                    this.handleBuy();
                  }
                }}
                onChange={this.handleTotalInput}
                error={!totalValid}
                value={total}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomButton
                disabled={!(totalValid && countValid)}
                fullWidth
                onClick={this.handleBuy}
              >
                Buy
              </CustomButton>
            </Grid>
            <Grid item xs={2}>
              <CustomButton
                disabled={!(totalValid && countValid)}
                fullWidth
                onClick={this.handleSell}
              >
                Sell
              </CustomButton>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuySellWidget);
