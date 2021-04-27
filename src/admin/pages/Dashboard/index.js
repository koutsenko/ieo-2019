import styles from "./index.module.css";

import React, { Component } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import {
  Dashboard,
  Layers,
  SentimentSatisfied,
  People
} from "@material-ui/icons/";

import PageContainer from "common/components/PageContainer";
import PageHeading from "common/components/PageHeading";
import ToolbarMain from "common/components/ToolbarMain";
import ServerState from "admin/containers/ServerState";
import CurrentGame from "admin/containers/CurrentGame";
import GameHistory from "admin/containers/GameHistory";
import UIKitDemo from "admin/containers/UIKitDemo";

const mainListItems = (
  <div>
    <ListItem component={Link} to="/admin/dashboard" button>
      <ListItemIcon classes={{ root: styles.icon }}>
        <Dashboard />
      </ListItemIcon>
      <ListItemText primary="Accounts list" />
    </ListItem>
    <ListItem component={Link} to="/admin/dashboard/game" button>
      <ListItemIcon classes={{ root: styles.icon }}>
        <People />
      </ListItemIcon>
      <ListItemText primary="Current game" />
    </ListItem>
    <ListItem component={Link} to="/admin/dashboard/history" button>
      <ListItemIcon classes={{ root: styles.icon }}>
        <Layers />
      </ListItemIcon>
      <ListItemText primary="Game history" />
    </ListItem>
    <ListItem component={Link} to="/admin/dashboard/design" button>
      <ListItemIcon classes={{ root: styles.icon }}>
        <SentimentSatisfied />
      </ListItemIcon>
      <ListItemText primary="UI kit demo" />
    </ListItem>
  </div>
);

class DashboardPage extends Component {
  render() {
    const { tokenName } = this.props;

    return (
      <PageContainer>
        <PageHeading>Dashboard</PageHeading>
        <ToolbarMain {...{ tokenName, loginRoute: "/admin/login" }}>
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            Dashboard
          </Typography>
        </ToolbarMain>
        <div className={styles.container}>
          <Drawer
            classes={{ root: styles.r, paper: styles.drawerPaper }}
            variant="permanent"
            open={true}
          >
            <List>{mainListItems}</List>
          </Drawer>
          <Switch>
            <Route exact path="/admin/dashboard">
              <ServerState />
            </Route>
            <Route exact path="/admin/dashboard/game">
              <CurrentGame />
            </Route>
            <Route exact path="/admin/dashboard/history">
              <GameHistory />
            </Route>
            <Route exact path="/admin/dashboard/design">
              <UIKitDemo />
            </Route>
            <Route render={() => <Redirect to="/admin/dashboard" />} />
          </Switch>
        </div>
      </PageContainer>
    );
  }
}

export default DashboardPage;
