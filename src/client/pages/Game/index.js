import styles from "./index.module.css";

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Tab, Tabs, Typography } from "@material-ui/core";

import loadTurn from "client/actions/loadTurn";
import revertOrders from "client/actions/revertOrders";
import turn from "client/actions/turn";
import doGameJoin from "client/api/doGameJoin";
import getGameState from "common/api/getGameState";
import {
  GAME_STATE_RUNNING,
  GAME_STATE_NOT_RUNNING,
  GAME_STATE_SUSPENDED
} from "common/constants/states/game";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import PageContainer from "common/components/PageContainer";
import PageHeading from "common/components/PageHeading";
import refreshGameState from "common/actions/game/refreshGameState";
import ToolbarMain from "common/components/ToolbarMain";
import GameEndByPensionDialog from "client/components/Dialogs/GameEndByPension";
import GameEndByWinDialog from "client/components/Dialogs/GameEndByWin";
import GameEndByBankruptcyDialog from "client/components/Dialogs/GameEndByBankruptcy";
import ViewOrdersDialog from "client/components/Dialogs/ViewOrders";
import GameWaitLocker from "client/components/Lockers/GameWait";
import GameSuspendedLocker from "client/components/Lockers/GameSuspended";
import ActionsContainer from "client/containers/Actions";
import NewsContainer from "client/containers/News";
import StateContainer from "client/containers/State";
import StatusContainer from "client/containers/Status";
import CustomAppBarButton from "common/ui-kit/CustomAppBar/Button";
import DemiurgBar from "demiurg/components/DemiurgBar";
import MarginCallDialog from "client/components/Dialogs/MarginCall";
import PossibleBankruptcyDialog from "client/components/Dialogs/PossibleBankruptcy";
import closeBankruptcy from "client/actions/closeBankruptcy";
import ReplayBar from "replay/components/ReplayBar";

const mapStateToProps = state => ({
  gameState: state.game.gameState,
  turnState: state.game.turnState,
  orderedTurnState: state.game.orderedTurnState,
  eventsCollapsed: state.uiclient.eventsCollapsed,
  demiurg:
    state.game.turnState === undefined
      ? undefined
      : state.game.turnState.demiurg
});

const mapDispatchToProps = {
  req,
  showSnackbar,
  refreshGameState,
  loadTurn,
  closeBankruptcy
};

class GamePage extends Component {
  state = {
    screen: 0,
    confirmTurnDialog: false,
    mcDialog: false,
    newsSource: null,
    ftDisabled: false
  };

  constructor(props) {
    super(props);

    // Из контейнера действий пробросим массивы активных групп в новости.
    this.notifyNewsCb = this.notifyNewsCb.bind(this);
    this.closeBankruptcy = this.closeBankruptcy.bind(this);
    this.handleMcDialogClose = this.handleMcDialogClose.bind(this);
  }

  async componentDidMount() {
    const { gameState } = this.props;

    if (gameState === undefined) {
      await this.refreshGameState();
    }
  }

  closeBankruptcy() {
    const { closeBankruptcy } = this.props;

    closeBankruptcy();
  }

  notifyNewsCb(newsSource) {
    this.setState({ newsSource });
  }

  handleMcDialogClose() {
    this.setState({ mcDialog: false });
  }

  async refreshGameState() {
    const { loadTurn, req, showSnackbar, refreshGameState } = this.props;

    try {
      const gameState = await req(getGameState());
      refreshGameState(gameState);

      if (gameState === GAME_STATE_RUNNING) {
        try {
          const turnState = await req(doGameJoin());
          loadTurn(turnState);
        } catch (error) {
          showSnackbar(false, `Error joining to running game: ${error}`);
        }
      }
    } catch (error) {
      showSnackbar(false, `Error game status query: ${error}`);
    }
  }

  doTurn = async forced => {
    const { req, showSnackbar, loadTurn } = this.props;
    await this.setState({ ftDisabled: true });

    try {
      const turnState = await req(turn(forced));
      loadTurn(turnState);

      if (turnState.margin_call_last_data !== null) {
        this.setState({ mcDialog: true });
      }
      setTimeout(() => {
        this.setState({ ftDisabled: false });
      }, 100);
    } catch (error) {
      showSnackbar(false, `Error turn end: ${error}`);
    }
  };

  doRevertOrders = async () => {
    const { req, showSnackbar, loadTurn } = this.props;

    try {
      const turnState = await req(revertOrders());
      loadTurn(turnState);
    } catch (error) {
      showSnackbar(false, `Error revert orders: ${error}`);
    }
  };

  handleChange = (event, value) => {
    const screen = value;

    this.setState({ screen });
  };

  render() {
    const {
      demiurg,
      gameState,
      eventsCollapsed,
      turnState,
      orderedTurnState,
      tokenName
    } = this.props;
    const {
      confirmTurnDialog,
      mcDialog,
      screen,
      newsSource,
      ftDisabled
    } = this.state;
    const negativeBalanceFlag = turnState && turnState.negativeBalanceFlag;

    // Choose one possibly game end. Only one.
    let end;
    if (gameState === GAME_STATE_RUNNING && turnState) {
      let { endByWin, endByPension, endByBankruptcy } = turnState;
      if (endByBankruptcy) {
        end = "endByBankruptcy";
      } else if (endByWin) {
        end = "endByWin";
      } else if (endByPension) {
        end = "endByPension";
      }
    }

    return (
      <Fragment>
        {confirmTurnDialog && (
          <ViewOrdersDialog
            onRevert={this.doRevertOrders}
            onClose={() => this.setState({ confirmTurnDialog: false })}
          />
        )}
        {
          {
            endByBankruptcy: <GameEndByBankruptcyDialog />,
            endByPension: <GameEndByPensionDialog />,
            endByWin: <GameEndByWinDialog />
          }[end]
        }

        <PageContainer>
          <PageHeading>Game</PageHeading>
          <ToolbarMain
            {...{ tokenName, loginRoute: "/login" }}
            disabled={gameState === GAME_STATE_SUSPENDED}
          >
            {[GAME_STATE_RUNNING, GAME_STATE_SUSPENDED].includes(gameState) && (
              <Fragment>
                {turnState && (
                  <Typography variant="h6">Year {turnState.turn}</Typography>
                )}
                <Tabs
                  classes={{
                    flexContainer: styles.flexContainer,
                    indicator: styles.indicator,
                    root: styles.tabs,
                    scroller: styles.scroller
                  }}
                  value={screen}
                  onChange={this.handleChange}
                  TabIndicatorProps={{ style: { background: "lime" } }}
                >
                  <Tab label="State" />
                  <Tab label="Actions" />
                </Tabs>
                <div className={styles["flexed-right"]}>
                  <CustomAppBarButton
                    onClick={() => this.setState({ confirmTurnDialog: true })}
                  >
                    View orders
                  </CustomAppBarButton>
                  <CustomAppBarButton
                    disabled={ftDisabled}
                    onClick={() => this.doTurn(false)}
                  >
                    Finish turn
                  </CustomAppBarButton>
                  {turnState && (
                    <Typography variant="h6" style={{ margin: "0 1em" }}>
                      {turnState.scenario_name}
                    </Typography>
                  )}
                </div>
              </Fragment>
            )}
          </ToolbarMain>
          {gameState === GAME_STATE_RUNNING && turnState && (
            <Fragment>
              <div className={styles["state-n-actions-container"]}>
                {screen === 0 && <StateContainer />}
                {screen === 1 && (
                  <ActionsContainer notifyNewsCb={this.notifyNewsCb} />
                )}
              </div>
              <StatusContainer />
              <div
                className={`${styles["bottom-margin"]} ${
                  eventsCollapsed
                    ? styles["bottom-margin-collapsed"]
                    : styles["bottom-margin-full"]
                }`}
              />
              <NewsContainer {...{ screen, orderedTurnState, newsSource }} />
            </Fragment>
          )}
        </PageContainer>
        {gameState === GAME_STATE_NOT_RUNNING && <GameWaitLocker />}
        {gameState === GAME_STATE_SUSPENDED && <GameSuspendedLocker />}
        {demiurg && <DemiurgBar />}
        {!end && mcDialog && turnState.margin_call_last_data && (
          <MarginCallDialog
            {...{
              turnState,
              onClose: this.handleMcDialogClose
            }}
          />
        )}
        {negativeBalanceFlag && (
          <PossibleBankruptcyDialog
            onClose={this.closeBankruptcy}
            onForceTurn={async () => {
              await this.doTurn(true);
            }}
          />
        )}
        {demiurg && <ReplayBar />}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage);
