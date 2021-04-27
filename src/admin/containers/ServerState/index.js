import styles from "./index.module.css";

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { List, ListItem, Paper } from "@material-ui/core";

import getAccounts from "admin/api/getAccounts";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import doRevertTurn from "admin/api/doRevertTurn";
import doExportLog from "admin/api/doExportLog";

import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const mapStateToProps = null;

const mapDispatchToProps = {
  req,
  showSnackbar
};

class ServerState extends Component {
  state = {
    accounts: [],
    log: null,
    logNick: ""
  };

  constructor(props) {
    super(props);

    this.handleRevertTurn = this.handleRevertTurn.bind(this);
  }

  async componentDidMount() {
    const { req, showSnackbar } = this.props;

    try {
      const accounts = await req(getAccounts());

      this.setState({ accounts });
    } catch (error) {
      showSnackbar(false, `Query error: ${error}`);
    }
  }

  handleRevertTurn = (login, dropOrders) => async () => {
    const { req, showSnackbar } = this.props;

    try {
      await req(doRevertTurn(login, dropOrders));
      showSnackbar(true, `Query success`);
    } catch (error) {
      showSnackbar(false, `Query error: ${error}`);
    }
  };

  handleExportLog = login => async () => {
    const { req, showSnackbar } = this.props;

    try {
      const log = await req(doExportLog(login));
      this.setState({ log, logNick: login });
    } catch (error) {
      showSnackbar(false, `Query error: ${error}`);
    }
  };

  buildPlayersList() {
    const { accounts } = this.state;

    if (accounts === undefined || accounts.length === 0) {
      return null;
    } else {
      return (
        <List>
          {accounts.map((account, index) => {
            const { login } = account;
            const isAdmin = [0, 1, 2].includes(index);

            return (
              <ListItem key={login} classes={{ root: styles.row }}>
                <span className={styles.column1}>
                  {login}
                  {isAdmin && <span className={styles.asterisk}>*</span>}
                </span>
                <span className={styles.padding}>&nbsp;</span>
                <div className={styles.actions}>
                  <button onClick={this.handleRevertTurn(login)}>
                    -1 turn, keep orders
                  </button>
                  <button onClick={this.handleRevertTurn(login, true)}>
                    -1 turn, drop orders
                  </button>
                  <button onClick={this.handleExportLog(login)}>
                    view log
                  </button>
                </div>
              </ListItem>
            );
          })}
        </List>
      );
    }
  }

  render() {
    const { log, logNick } = this.state;

    return (
      <Fragment>
        <Paper classes={{ root: styles.container }}>
          {this.buildPlayersList()}
        </Paper>
        {log !== null && (
          <CustomDialog
            {...{
              title: "log",
              content: (
                <div className={styles.logContainer}>
                  <div>
                    {log.map((row, index) => (
                      <CustomText key={index}>{row}</CustomText>
                    ))}
                  </div>
                </div>
              ),
              actions: {
                download: () => {
                  download(logNick, log.join("\n"));
                },
                close: () => {
                  this.setState({ log: null });
                }
              },
              width: "100%"
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
)(ServerState);
