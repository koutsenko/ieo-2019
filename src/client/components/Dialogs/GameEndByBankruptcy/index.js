import styles from "./index.module.css";

import React from "react";
import { connect } from "react-redux";

import doPlayAgain from "client/api/doPlayAgain";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";

const mapStateToProps = state => ({
  turnState: state.game.turnState
});

const mapDispatchToProps = {
  req,
  showSnackbar
};

const GameEndByBankruptcyDialog = ({ turnState: { can_replay }, ...props }) => (
  <CustomDialog
    {...{
      ...(can_replay && {
        actions: {
          "Start new game": async () => {
            const { req, showSnackbar } = props;

            try {
              await req(doPlayAgain());
            } catch (error) {
              showSnackbar(false, `Error starting game again: ${error}`);
            }
          }
        }
      }),
      title: "Congratulations!",
      content: (
        <div className={styles.content}>
          <CustomText>You are a bankrupt.</CustomText>
        </div>
      )
    }}
  />
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameEndByBankruptcyDialog);
