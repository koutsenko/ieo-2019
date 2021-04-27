import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import loadTurn from "client/actions/loadTurn";
import doOrder from "client/actions/order";
import { PAY_LEVERAGE_BODY } from "common/constants/orders";
import CustomTable from "common/ui-kit/CustomTable";
import CustomButtonDots from "common/ui-kit/CustomButtonDots";
import CustomMenu from "common/ui-kit/CustomMenu";
import { fmt, trimDigits } from "common/utils/money";
import viewRemainingPercents from "common/calc/viewRemainingPercents";
import viewCreditPeriods from "common/calc/viewCreditPeriods";
import CreditRepaymentDialog from "client/components/Dialogs/CreditRepayment";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState
});

const mapDispatchToProps = {
  req,
  loadTurn,
  showSnackbar
};

class LiabsTable extends Component {
  state = {
    earlyCreditRepayment: false,
    earlyCreditRepaymentFinancialPropertyId: null,
    menuData: null
  };

  constructor(props) {
    super(props);

    this.closeCreditRepaymentDlg = this.closeCreditRepaymentDlg.bind(this);
  }

  closeCreditRepaymentDlg = () => {
    this.setState({
      earlyCreditRepayment: false,
      earlyCreditRepaymentFinancialPropertyId: null
    });
  };

  async payLeverage() {
    const { loadTurn, req, showSnackbar } = this.props;
    const action = PAY_LEVERAGE_BODY;
    const order = doOrder({ action });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Payment successful");
    } catch (error) {
      showSnackbar(false, `Payment error: ${error}`);
    }

    this.setState({ openedMenuId: null });
  }

  menuHandler = ({ target, type, financialPropertyId }) => {
    if (type !== undefined) {
      // скорее всего кликнули на меню у лиабса с типом leverage_credit
      this.setState({
        menuData: { target, type }
      });
    } else if (financialPropertyId !== undefined) {
      this.setState({
        menuData: { target, financialPropertyId } // скорее всего кликнули на меню у лиабса с типом "кредит"
      });
    }
  };

  buildTaxRate() {
    const { orderedTurnState } = this.props;
    const { assets, liabilities } = orderedTurnState;
    const taxRate = liabilities.find(l => l.type === "current_tax_rate").value;
    const { value } = assets.find(a => a.type === "current_income");
    const tax = value * taxRate;

    return ["Taxes", fmt(tax), `${taxRate * 100}% of income`, ""];
  }

  buildRentalCost() {
    const { orderedTurnState } = this.props;
    const { liabilities } = orderedTurnState;
    const rent = liabilities.find(l => l.type === "rental").value;

    return ["Rent", `${fmt(rent)}`, "", ""];
  }

  buildLifeCost() {
    const { orderedTurnState } = this.props;
    const { assets, liabilities } = orderedTurnState;
    const income = assets.find(a => a.type === "current_income").value;
    const life_raw = liabilities.find(l => l.type === "current_life").value;
    const life = (income * parseInt(life_raw.split("%")[0])) / 100;

    return ["Life expenses", fmt(life), `${life_raw} of income`, ""];
  }

  buildLeverageCredit() {
    const { orderedTurnState } = this.props;
    const { currentLeverageCreditCost, liabilities } = orderedTurnState;
    const leverage_credit = liabilities.find(l => l.type === "leverage_credit");

    return leverage_credit === undefined
      ? null
      : [
          "Leverage credit",
          fmt((leverage_credit.principal * currentLeverageCreditCost) / 100),
          `${currentLeverageCreditCost}% of debt`,
          fmt(leverage_credit.principal),
          <CustomButtonDots
            onClick={event =>
              this.menuHandler({
                target: event.target,
                type: leverage_credit.type
              })
            }
          />
        ];
  }

  buildCredits() {
    const { orderedTurnState } = this.props;
    const { liabilities } = orderedTurnState;
    const credits = liabilities.filter(l => l.type === "credit");

    return credits.length === 0
      ? null
      : {
          children: credits.map((credit, index) => {
            const {
              financialPropertyId,
              principal,
              principal_remaining,
              years,
              years_remaining,
              percent,
              id
            } = credit;

            // Полная разблюдовка платежей для дальнейшего использования
            const periods = viewCreditPeriods(
              0,
              years,
              credit,
              principal,
              percent
            );

            const isFresh = years === years_remaining;
            let details; // Детализация платежа
            let currentPayment; // Текущий платёж
            if (isFresh) {
              details = "";
              currentPayment = "";
            } else {
              const payment = periods[years - years_remaining - 1];
              const pd_body = fmt(payment[3]);
              const pd_interest = fmt(payment[4]);
              currentPayment = fmt(payment[2]);
              details = (
                <Fragment>
                  <span style={{ color: "green" }}>{pd_body}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span style={{ color: "red" }}>{pd_interest}</span>
                </Fragment>
              );
            }

            // Долг к выплате
            const dpr = fmt(principal_remaining);
            const dp = trimDigits(percent);
            const dir = fmt(
              viewRemainingPercents(credit, years - years_remaining)
            );
            const debt = `${dpr} (${years_remaining}yr; ${dp}%; ${dir})`;

            return [
              id === 0 ? "Mortgage" : `Credit ${index + 1}`,
              currentPayment,
              details,
              debt,
              <CustomButtonDots
                onClick={event =>
                  this.menuHandler({
                    financialPropertyId,
                    target: event.target
                  })
                }
              />
            ];
          }),
          data: ["Credits"],
          keys: credits.map(credit => credit.financialPropertyId)
        };
  }

  buildClosedCredits() {
    const { orderedTurnState } = this.props;
    const { closedCredits } = orderedTurnState;

    return closedCredits.length === 0
      ? null
      : {
          children: closedCredits.map((credit, index) => {
            const {
              principal,
              principal_remaining,
              years,
              years_remaining,
              percent,
              id
            } = credit;

            // Полная разблюдовка платежей для дальнейшего использования
            const periods = viewCreditPeriods(
              0,
              years,
              credit,
              principal,
              percent
            );

            let details; // Детализация платежа
            let currentPayment; // Текущий платёж

            const payment = periods[periods.length - 1];
            const pd_body = fmt(payment[3]);
            const pd_interest = fmt(payment[4]);
            currentPayment = fmt(payment[2]);
            details = (
              <Fragment>
                <span style={{ color: "green" }}>{pd_body}</span>
                <span>&nbsp;/&nbsp;</span>
                <span style={{ color: "red" }}>{pd_interest}</span>
              </Fragment>
            );

            // Долг к выплате
            const dpr = fmt(principal_remaining);
            const dp = trimDigits(percent);
            const dir = fmt(
              viewRemainingPercents(credit, years - years_remaining)
            );
            const debt = `${dpr} (${years_remaining}yr; ${dp}%; ${dir})`;

            return [
              id === 0 ? "Mortgage" : `Credit ${index + 1}`,
              currentPayment,
              details,
              debt,
              ""
            ];
          }),
          data: ["Closed credits"],
          keys: closedCredits.map(credit => credit.financialPropertyId)
        };
  }

  render() {
    const {
      earlyCreditRepayment,
      earlyCreditRepaymentFinancialPropertyId,
      menuData
    } = this.state;

    return (
      <Fragment>
        <CustomTable
          {...{
            colWidth: ["20%", "25%", "20%", "30%", "5%"],
            cols: [
              "Name",
              "Curr pmnt",
              "Pmnt details", //(debt+%)
              "Debt (time,%,overpayment)",
              ""
            ],
            data: [
              this.buildTaxRate(),
              this.buildRentalCost(),
              this.buildLifeCost(),
              this.buildLeverageCredit(),
              this.buildCredits(),
              this.buildClosedCredits()
            ],
            keys: [
              "row_taxrate",
              "row_rental_cost",
              "row_life_cost",
              "row_leverage_credits",
              "row_credits"
            ]
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
              menuItems:
                menuData.type !== undefined
                  ? {
                      "Pay entire leverage": () => {
                        this.payLeverage();
                      }
                    }
                  : {
                      "Early credit repayment": () => {
                        this.setState({
                          earlyCreditRepayment: true,
                          earlyCreditRepaymentFinancialPropertyId:
                            menuData.financialPropertyId
                        });
                      }
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiabsTable);
