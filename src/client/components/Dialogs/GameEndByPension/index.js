import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";
import winValue from "common/calc/winValue";
import { fmt } from "common/utils/money";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";
import doPlayAgain from "client/api/doPlayAgain";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";

// Use non-ordered turnState!
const mapStateToProps = state => ({
  turnState: state.game.turnState
});

const mapDispatchToProps = {
  req,
  showSnackbar
};

class GameEndByPensionDialog extends Component {
  render() {
    const { turnState } = this.props;
    const { can_replay } = turnState;

    const totalAssets = sumAssets(turnState);
    const totalLiabs = sumLiabs(turnState);

    const balance = parseFloat(totalAssets) - parseFloat(totalLiabs);
    const balancePrint = fmt(balance);

    const winBalance = winValue(turnState);
    const winBalancePrint = fmt(winBalance);

    return (
      <CustomDialog
        {...{
          title: "Game end",
          content: (
            <div className={styles.content}>
              <CustomText>
                You have retired with {balancePrint} of capital at your
                disposal.
              </CustomText>
              <CustomText>
                While you need {winBalancePrint} to retire with a secure
                pension.
              </CustomText>
            </div>
          ),
          actions: {
            ...(can_replay && {
              "Start new game": async () => {
                const { req, showSnackbar } = this.props;

                try {
                  await req(doPlayAgain());
                } catch (error) {
                  showSnackbar(false, `Error starting game again: ${error}`);
                }
              }
            })
          }
        }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameEndByPensionDialog);
