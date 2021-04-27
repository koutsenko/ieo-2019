import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";
import { Home } from "@material-ui/icons";

import getTodayInstrument from "common/selectors/todayInstrument";
import chosenDayInstrument from "common/selectors/chosenDayInstrument";
import costDelta from "common/selectors/costDelta";
import sumMoney from "common/calc/sumMoney";
import getFreeIncome from "common/calc/getFreeIncome";
import getOwnedCash from "common/calc/getOwnedCash";
import sumExpired from "common/calc/sumExpired";
import { fmt, trimDigits } from "common/utils/money";
import CustomTable from "common/ui-kit/CustomTable";
import loadTurn from "client/actions/loadTurn";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import doOrder from "client/actions/order";
import sumRf from "common/calc/sumRF";
import sumDividends from "common/calc/sumDividends";
import CustomMenu from "common/ui-kit/CustomMenu";
import CustomButtonDots from "common/ui-kit/CustomButtonDots";
import { CHANGE_RESIDENCE, SELL } from "common/constants/orders";
import { RESIDENCE_OWN } from "common/constants/residence";
import CostWithDelta from "client/components/CostWithDelta";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";
import getPropertyPrice from "common/logics/getPropertyPrice";
import getPropertyValue from "common/logics/getPropertyValue";
import getPropertyBondRemainingYears from "common/logics/getPropertyBondRemainingYears";
import getPropertyDividendsRate from "common/logics/getPropertyDividendsRate";

const mapStateToProps = state => ({
  orderedTurnState: state.game.orderedTurnState,
  turnState: state.game.turnState
});

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

const namesRf = type =>
  ({
    current_life: "Life expenses",
    current_tax_rate: "Taxes",
    rental: "Rent",
    leverage_payment: "Leverage payment",
    credit_payment: "Credit payment"
  }[type]);

/**
 * Pairs type - display name
 */
const assetsTypes = {
  Stock: "Stocks",
  Bond: "Bonds",
  ETF: "ETF",
  MF: "MF",
  Commodities: "Commodities",
  Index: "Indexes",
  ME: "Insurance",
  RE: "RE",
  Crypto: "Crypto",
  ULC: "ULC"
};

class AssetsTable extends Component {
  state = {
    openedMenuFinancialPropertyId: null,
    openedMenuParentElement: null,
    bondsDiscountWarningVisible: false,
    bondsDiscountWarningFinancialPropertyId: null
  };

  constructor(props) {
    super(props);

    this.openMenu = this.openMenu.bind(this);

    this.handleSellAttempt = this.handleSellAttempt.bind(this);
    this.sell = this.sell.bind(this);
  }

  async sell(financialPropertyId) {
    const { req, showSnackbar, loadTurn, orderedTurnState } = this.props;
    const prop = orderedTurnState.assets.find(
      a => a.financialPropertyId === financialPropertyId
    );
    const { id, count, re_condition } = prop;
    const action = SELL;
    const order = doOrder({
      id,
      action,
      count,
      financialPropertyId,
      re_condition
    });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Order successful");
    } catch (error) {
      showSnackbar(false, `Order error: ${error}`);
    }
  }

  handleSellAttempt = start_turn => async () => {
    const { orderedTurnState } = this.props;
    const { openedMenuFinancialPropertyId } = this.state;
    const { type } = orderedTurnState.assets.find(
      a => a.financialPropertyId === openedMenuFinancialPropertyId
    );

    if (type !== "Bond" || start_turn === orderedTurnState.turn) {
      await this.sell(openedMenuFinancialPropertyId);
      this.setState({ openedMenuFinancialPropertyId: null });
    } else {
      this.setState({
        bondsDiscountWarningFinancialPropertyId: openedMenuFinancialPropertyId,
        bondsDiscountWarningVisible: true
      });
    }
  };

  handleChangeResidence = async financialPropertyId => {
    const { req, showSnackbar, loadTurn } = this.props;
    const action = CHANGE_RESIDENCE;
    const order = doOrder({ action, financialPropertyId });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Action successful");
    } catch (error) {
      showSnackbar(false, `Action error: ${error}`);
    }
  };

  openMenu = financialPropertyId => event => {
    this.setState({
      openedMenuFinancialPropertyId: financialPropertyId,
      openedMenuParentElement: event.target
    });
  };

  closeMenu = () => {
    this.setState({
      openedMenuFinancialPropertyId: null,
      openedMenuParentElement: null
    });
  };

  buildMoney() {
    const { orderedTurnState } = this.props;

    return {
      children: [
        this.buildCash(),
        this.buildExpiredBonds(),
        this.buildDividends(),
        this.buildReservedFunds()
      ],
      data: ["Money", "", "", fmt(sumMoney(orderedTurnState))],
      keys: [
        "row_cash",
        "row_expired_bonds",
        "row_dividends",
        "row_reserved_funds"
      ]
    };
  }

  buildCash() {
    const { orderedTurnState } = this.props;
    const { money } = orderedTurnState;
    const ownedCash = getOwnedCash(orderedTurnState);
    const freeIncome = getFreeIncome(orderedTurnState);

    return {
      children: [
        ["Owned cash", "", "", fmt(ownedCash)],
        ["Free income", "", "", fmt(freeIncome)]
      ],
      data: ["Cash", "", "", fmt(money)],
      collapsed: true,
      keys: ["owned_cash_row", "free_income_row"]
    };
  }

  buildExpiredBonds() {
    const { orderedTurnState } = this.props;
    const { expiredBonds } = orderedTurnState;

    return expiredBonds.length === 0
      ? null
      : {
          children: expiredBonds.map(({ sum, name }) => {
            return [name, "", "", fmt(sum)];
          }),
          data: ["Bonds expiration", "", "", fmt(sumExpired(orderedTurnState))],
          keys: expiredBonds.map(f => f.financialPropertyId)
        };
  }

  buildDividends() {
    const { orderedTurnState } = this.props;
    const { dividends } = orderedTurnState;

    return dividends.length === 0
      ? null
      : {
          children: dividends.map(({ sum, name }) => [name, "", "", fmt(sum)]),
          data: ["Dividends", "", "", fmt(sumDividends(orderedTurnState))],
          collapsed: true,
          keys: dividends.map(f => f.financialPropertyId)
        };
  }

  buildReservedFunds() {
    const { orderedTurnState } = this.props;
    const { reservedFunds } = orderedTurnState;
    const funds = reservedFunds.filter(
      ({ type, value }) => !(type === "leverage_payment" && value === 0)
    );

    return {
      children: funds.map(({ type, value }) => {
        return [namesRf(type), "", "", fmt(value)];
      }),
      data: ["Reserved Funds", "", "", fmt(sumRf(orderedTurnState))],
      collapsed: true,
      keys: funds.map(f => f.type)
    };
  }

  buildAssetInstrument(type) {
    const { orderedTurnState, turnState } = this.props;
    const { instruments, assets, turn, defaultInstrDigits } = orderedTurnState;
    const { meta, names } = instruments;
    const ids = Object.keys(meta).filter(key => meta[key].type === type);
    const typeAssets = assets.filter(a => ids.includes(a.id));

    let result =
      typeAssets.length === 0
        ? null
        : {
            children: typeAssets.map(({ id, count, financialPropertyId }) => {
              const { name } = names[id];
              const { digits } = meta[id].static_params;
              const dig =
                digits !== undefined ? parseInt(digits) : defaultInstrDigits;
              const cost = getPropertyPrice(
                financialPropertyId,
                orderedTurnState
              );

              const displayCost = (
                <CostWithDelta
                  {...{
                    cost,
                    delta:
                      type === "Bond"
                        ? 0
                        : fmt(costDelta(orderedTurnState, id), dig),
                    digits: dig,
                    omitDelta: true
                  }}
                />
              );

              // А что если бондам дать дивиденды в %, все ж сломается из-а trimDigits на строке...
              const details =
                type === "Bond" ? (
                  <Typography>
                    /
                    {trimDigits(
                      getPropertyDividendsRate(
                        financialPropertyId,
                        orderedTurnState
                      )
                    )}
                    %/
                    {getPropertyBondRemainingYears(
                      financialPropertyId,
                      orderedTurnState
                    )}
                    yr
                  </Typography>
                ) : null;

              const price = (
                <Fragment>
                  {displayCost}
                  {details}
                </Fragment>
              );

              const value = fmt(
                getPropertyValue(financialPropertyId, orderedTurnState)
              );

              return [
                name,
                price,
                `${count} pcs`,
                value,
                <Fragment>
                  <CustomButtonDots
                    onClick={this.openMenu(financialPropertyId)}
                  />
                  {orderedTurnState.residence.type === RESIDENCE_OWN &&
                    orderedTurnState.residence.financialPropertyId ===
                      financialPropertyId && <Home style={{ margin: "3px" }} />}
                </Fragment>
              ];
            }),
            data: [
              assetsTypes[type],
              "",
              "",
              <CostWithDelta
                {...{
                  type: 2, // magic.
                  cost: typeAssets.reduce((acc, cur) => {
                    const { financialPropertyId } = cur;
                    const value = getPropertyValue(
                      financialPropertyId,
                      orderedTurnState
                    );
                    const res = acc + value;

                    return res;
                  }, 0),
                  delta: typeAssets.reduce((acc, cur, index, all) => {
                    // Use plain turnState instead of orderedTurnState
                    const { id, count, start_turn } = cur;
                    const asset =
                      type === "Bond"
                        ? chosenDayInstrument(turnState, id, start_turn)
                        : getTodayInstrument(turnState, id);
                    const res =
                      asset === undefined ? acc : acc + count * asset.cost;

                    const pAsset =
                      type === "Bond"
                        ? chosenDayInstrument(turnState, id, start_turn)
                        : chosenDayInstrument(turnState, id, turn - 1);
                    const prev = pAsset === undefined ? 0 : count * pAsset.cost;

                    return res - prev;
                  }, 0),
                  digits: defaultInstrDigits,
                  omitDelta: true
                }}
              />
            ],
            keys: typeAssets.map(ta => ta.financialPropertyId)
          };

    return result;
  }

  render() {
    const { orderedTurnState } = this.props;
    const {
      bondsDiscountWarningVisible,
      openedMenuFinancialPropertyId,
      openedMenuParentElement
    } = this.state;
    const { assets, instruments } = orderedTurnState;
    const menuOpened = openedMenuFinancialPropertyId !== null;

    let menuAsset, menuAssetType;
    if (menuOpened) {
      const fn = i => i.financialPropertyId === openedMenuFinancialPropertyId;
      menuAsset = assets.find(fn);
      menuAssetType = instruments.meta[menuAsset.id].type;
    }

    const types = Object.keys(assetsTypes);
    const instrumentAssets = types.map(type => this.buildAssetInstrument(type));

    return (
      <Fragment>
        <CustomTable
          {...{
            colWidth: ["35%", "20%", "15%", "20%", "10%"],
            cols: ["Name", "Price (cur)", "Qty", "Cost", ""],
            data: [this.buildMoney(), ...instrumentAssets],
            keys: ["money_row", ...types]
          }}
        />
        {menuOpened && (
          <CustomMenu
            anchorEl={openedMenuParentElement}
            onClose={this.closeMenu}
            open={true}
            menuItems={{
              ...{
                Sell: () => {
                  const { start_turn } = menuAsset;

                  this.handleSellAttempt(start_turn)();
                }
              },
              ...(menuAssetType === "RE" && {
                "Change residence": async () => {
                  await this.handleChangeResidence(
                    openedMenuFinancialPropertyId
                  );
                }
              })
            }}
          />
        )}
        {bondsDiscountWarningVisible && (
          <CustomDialog
            {...{
              title: "Manual bond sell",
              content: (
                <div>
                  <CustomText>
                    Discount will be applied. Proceed with this order?
                  </CustomText>
                </div>
              ),
              actions: {
                Yes: async () => {
                  const {
                    bondsDiscountWarningFinancialPropertyId
                  } = this.state;
                  await this.sell(bondsDiscountWarningFinancialPropertyId);

                  this.setState({
                    bondsDiscountWarningVisible: false,
                    openedMenuFinancialPropertyId: null,
                    bondsDiscountWarningFinancialPropertyId: null
                  });
                },
                No: () => {
                  this.setState({
                    bondsDiscountWarningVisible: false,
                    openedMenuFinancialPropertyId: null
                  });
                }
              }
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
)(AssetsTable);
