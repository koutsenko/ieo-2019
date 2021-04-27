import styles from "./index.module.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import sumAssets from "common/calc/sumAssets";
import sumLiabs from "common/calc/sumLiabs";
import { fmt } from "common/utils/money";
import doPlayAgain from "client/api/doPlayAgain";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";

// Use non-ordered turnState!
const mapStateToProps = state => ({
  turnState: state.game.turnState
});

const mapDispatchToProps = {
  req,
  showSnackbar
};

class GameEndByWinDialog extends Component {
  render() {
    const { turnState } = this.props;

    const totalAssets = sumAssets(turnState);
    const totalLiabs = sumLiabs(turnState);

    const balance = parseFloat(totalAssets) - parseFloat(totalLiabs);
    const balancePrint = fmt(balance);

    const { turn, can_replay } = turnState;

    return (
      <CustomDialog
        {...{
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
          },
          title: "Congratulations!",
          content: (
            <div className={styles.content}>
              <CustomText>
                You have accumulated {balancePrint} capital on {turn} year,
              </CustomText>
              <CustomText>and successfully ended the game.</CustomText>
            </div>
          )
        }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameEndByWinDialog);
