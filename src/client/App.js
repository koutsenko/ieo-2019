import React, { Component, Fragment } from "react";
import { withCookies } from "react-cookie";
import { connect } from "react-redux";
import { Router, Redirect, Route, Switch } from "react-router-dom";

import { CssBaseline } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";

import createSocket from "common/actions/socket/create";
import SocketReconnectLocker from "common/components/Lockers/SocketReconnect";
import SnackbarComponent from "common/components/Snackbar";
import {
  AUTH_AUTHORIZED,
  AUTH_UNAUTHORIZED
} from "common/constants/states/auth";
import GamePage from "./pages/Game";
import LoginPage from "./pages/Login";
import history from "common/utils/history";
import Fonts from "common/components/Fonts";

import "typeface-roboto";
import "typeface-roboto-mono";

const mapStateToProps = state => ({
  status: state.auth.status
});

const mapDispatchToProps = {
  createSocket
};

class App extends Component {
  componentDidMount() {
    const { cookies, createSocket, tokenName, url } = this.props;

    createSocket(url, cookies, tokenName);
  }

  render() {
    const { status, tokenName, url } = this.props;

    return (
      <Fragment>
        <Fonts />
        <StylesProvider injectFirst>
          <CssBaseline />
          <Router {...{ history }}>
            <Fragment>
              {status === AUTH_UNAUTHORIZED && (
                <Switch>
                  <Route
                    exact
                    path="/login"
                    render={() => <LoginPage {...{ tokenName }} />}
                  />
                  <Route>
                    <Redirect to="/login" />
                  </Route>
                </Switch>
              )}
              {status === AUTH_AUTHORIZED && (
                <Switch>
                  <Route
                    path="/game"
                    render={() => <GamePage {...{ tokenName }} />}
                  />
                  <Route>
                    <Redirect to="/game" />
                  </Route>
                </Switch>
              )}
            </Fragment>
          </Router>
          <SocketReconnectLocker {...{ tokenName, url }} />
          <SnackbarComponent />
        </StylesProvider>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCookies(App));
