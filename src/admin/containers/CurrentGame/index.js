import styles from "./index.module.css";

import cn from "classnames";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";

import CustomDialog from "common/ui-kit/CustomDialog";
import {
  GAME_STATE_NOT_RUNNING,
  GAME_STATE_RUNNING
} from "common/constants/states/game";
import req from "common/actions/socket/req";
import getGameState from "common/api/getGameState";
import getScenario from "admin/api/getScenario";
import doScenarioImport from "admin/api/doScenarioImport";
import doGameStart from "common/api/doGameStart";
import doGameStop from "common/api/doGameStop";
import doGameForceEnd from "common/api/doForceGameEnd";
import showSnackbar from "common/actions/ui/showSnackbar";
import refreshGameState from "common/actions/game/refreshGameState";
import readScenario from "admin/actions/readScenario";

const mapStateToProps = state => ({
  gameState: state.server.gameState,
  instruments: state.server.instruments,
  scenario: state.server.scenario
});

const mapDispatchToProps = {
  req,
  readScenario,
  refreshGameState,
  showSnackbar
};

class CurrentGame extends Component {
  state = {
    selectedInstrument: null,
    askStop: false
  };

  constructor(props) {
    super(props);

    this.forceAllEnd = this.forceAllEnd.bind(this);
    this.stopGameRequest = this.stopGameRequest.bind(this);
  }

  stopGameRequest = () => {
    this.setState({ askStop: true });
  };

  async componentDidMount() {
    const { gameState, scenario } = this.props;

    if (gameState === undefined) {
      await this.refreshGameState();
    }

    if (scenario === undefined) {
      await this.refreshScenario();
    }
  }

  refreshGameState = async () => {
    const { req, showSnackbar, refreshGameState } = this.props;

    try {
      const gameState = await req(getGameState());
      refreshGameState(gameState);
    } catch (error) {
      showSnackbar(false, `Game state refresh error: ${error}`);
    }
  };

  refreshScenario = async forceUpdateFromSheets => {
    const { req, showSnackbar, readScenario } = this.props;

    try {
      if (forceUpdateFromSheets) {
        await req(doScenarioImport());
      }
      const scenario = await req(getScenario());
      readScenario(scenario);
    } catch (error) {
      showSnackbar(false, `Query scenario error: ${error}`);
    }
  };

  startGame = async () => {
    const { req, showSnackbar, refreshGameState } = this.props;
    try {
      const gameState = await req(doGameStart());
      refreshGameState(gameState);
    } catch (error) {
      showSnackbar(false, `Game start command error: ${error}`);
    }
  };

  stopGame = async () => {
    const { req, showSnackbar, refreshGameState } = this.props;
    try {
      const gameState = await req(doGameStop());
      refreshGameState(gameState);
    } catch (error) {
      showSnackbar(false, `Game stop command error: ${error}`);
    }
  };

  forceAllEnd = async () => {
    const { req, showSnackbar } = this.props;
    try {
      await req(doGameForceEnd());
    } catch (error) {
      showSnackbar(false, `Game force end command error: ${error}`);
    }
  };

  render() {
    const { gameState, scenario } = this.props;
    const status =
      {
        [GAME_STATE_NOT_RUNNING]: "not running",
        [GAME_STATE_RUNNING]: "running"
      }[gameState] || "unknown";
    const { selectedInstrument, askStop } = this.state;

    return (
      <Fragment>
        <div className={styles.container}>
          <Paper classes={{ root: styles.card }}>
            <div className={styles.cardRow}>
              <Typography variant="h6">Status: {status}</Typography>
              <div>
                <Button
                  disabled={gameState !== GAME_STATE_RUNNING}
                  onClick={this.forceAllEnd}
                >
                  Force game end for all
                </Button>
                <Button
                  disabled={gameState === GAME_STATE_RUNNING}
                  onClick={this.startGame}
                  variant="contained"
                >
                  Start new
                </Button>
                <Button
                  disabled={gameState === GAME_STATE_NOT_RUNNING}
                  onClick={this.stopGameRequest}
                  variant="contained"
                >
                  Stop current
                </Button>
              </div>
            </div>
          </Paper>
          <Paper classes={{ root: styles.card }}>
            <div className={styles.cardRow}>
              <Typography variant="h6">Scenario</Typography>
              <Button
                disabled={gameState === GAME_STATE_RUNNING}
                onClick={() => this.refreshScenario(true)}
                variant="contained"
              >
                Reload
              </Button>
            </div>
            <div style={{ padding: "0.5em" }}>
              {scenario === undefined ? (
                <Typography>Yet unknown</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>parameter</TableCell>
                      <TableCell>value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(scenario.globalParams).map(key => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {key}
                        </TableCell>
                        <TableCell>{scenario.globalParams[key]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Paper>
          <Paper classes={{ root: styles.card }}>
            <div className={styles.cardRow}>
              <Typography variant="h6">Instruments</Typography>
            </div>
            <div className={styles.cardRow}>
              {scenario === undefined ? (
                <Typography>Yet unknown</Typography>
              ) : (
                <div className={styles.instruments}>
                  <div>
                    <Typography variant="h6">Instruments list</Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>id</TableCell>
                          <TableCell>type</TableCell>
                          <TableCell>name</TableCell>
                          <TableCell>static params</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(scenario.instruments.meta)
                          .map(key => scenario.instruments.meta[key])
                          .map(({ id, type, static_params }) => (
                            <TableRow
                              className={cn(styles.instrument, {
                                [styles.instrumentSelected]:
                                  selectedInstrument === id,
                                [styles.instrumentEmpty]:
                                  scenario.instruments.history[id] &&
                                  scenario.instruments.history[id].length === 0,
                                [styles.instrumentBad]: !scenario.instruments
                                  .history[id]
                              })}
                              key={id}
                              onClick={() => {
                                this.setState({ selectedInstrument: id });
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {id}
                              </TableCell>
                              <TableCell>{type}</TableCell>
                              <TableCell>
                                {scenario.instruments.names[id].name}
                              </TableCell>
                              <TableCell>
                                {Object.keys(static_params).map(key => (
                                  <div key={key}>
                                    {key} = {static_params[key]}
                                  </div>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <Typography variant="h6">Instruments history</Typography>
                    {selectedInstrument === null ? (
                      "Не выбран инструмент"
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow key={-1}>
                            <TableCell>period</TableCell>
                            {scenario.instruments.meta[
                              selectedInstrument
                            ].params.map(p => (
                              <TableCell>{p}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {scenario.instruments.history[selectedInstrument]
                            .length === 0
                            ? "Нет записей"
                            : scenario.instruments.history[
                                selectedInstrument
                              ].map(entry => {
                                const { params } = scenario.instruments.meta[
                                  selectedInstrument
                                ];

                                return (
                                  <Fragment>
                                    <TableRow key={entry.period}>
                                      <TableCell>{entry.period}</TableCell>
                                      {params.map(p => (
                                        <TableCell>{entry[p]}</TableCell>
                                      ))}
                                    </TableRow>
                                  </Fragment>
                                );
                              })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Paper>
        </div>
        {askStop && (
          <CustomDialog
            {...{
              title: "Stop game?",
              content: "Do you really want to stop?",
              actions: {
                Cancel: () => {
                  this.setState({ askStop: false });
                },
                Yes: async () => {
                  await this.stopGame();
                  this.setState({ askStop: false });
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
)(CurrentGame);
