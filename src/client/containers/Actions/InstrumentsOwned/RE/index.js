import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";
import { Home } from "@material-ui/icons";

import doOrder from "client/actions/order";
import CustomButtonDots from "common/ui-kit/CustomButtonDots";
import CustomMenu from "common/ui-kit/CustomMenu";
import CustomTable from "common/ui-kit/CustomTable";
import { OWNED_RE_TABLE_TITLE } from "common/constants/messages";
import { CHANGE_RESIDENCE, SELL } from "common/constants/orders";
import loadTurn from "client/actions/loadTurn";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import { RESIDENCE_OWN } from "common/constants/residence";

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

class OwnedReContainer extends Component {
  state = {
    menuData: null
  };

  constructor(props) {
    super(props);

    this.handleChangeResidence = this.handleChangeResidence.bind(this);
    this.handleSell = this.handleSell.bind(this);
  }

  handleChangeResidence = financialPropertyId => async () => {
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

  handleSell = financialPropertyId => async () => {
    const { req, showSnackbar, loadTurn, orderedTurnState } = this.props;
    const count = 1;
    const action = SELL;
    const { id, re_condition } = orderedTurnState.assets.find(
      a => a.financialPropertyId === financialPropertyId
    );
    const order = doOrder({
      action,
      count,
      financialPropertyId,
      id,
      re_condition
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
    const { menuData } = this.state;
    const { names, meta } = orderedTurnState.instruments;
    const RE_ids = Object.keys(meta).filter(id => meta[id].type === "RE");

    return (
      <Fragment>
        <Typography>{OWNED_RE_TABLE_TITLE}</Typography>
        <CustomTable
          {...{
            cols: ["Item No.", "Name", "Condition", ""],
            colWidth: ["15%", "40%", "35", "10%"],
            data: orderedTurnState.assets
              .filter(a => RE_ids.includes(a.id))
              .map((RE, index) => {
                const { id, financialPropertyId, re_condition } = RE;

                return [
                  index + 1,
                  names[id].name,
                  re_condition,
                  <Fragment>
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
                    {orderedTurnState.residence.type === RESIDENCE_OWN &&
                      orderedTurnState.residence.financialPropertyId ===
                        financialPropertyId && (
                        <Home style={{ margin: "3px" }} />
                      )}
                  </Fragment>
                ];
              }),
            keys: orderedTurnState.assets
              .filter(a => RE_ids.includes(a.id))
              .map(RE => RE.financialPropertyId)
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
                Sell: this.handleSell(menuData.financialPropertyId),
                "Change residence": this.handleChangeResidence(
                  menuData.financialPropertyId
                )
              }
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(OwnedReContainer);
