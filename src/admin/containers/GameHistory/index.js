import React, { Component } from "react";
import { connect } from "react-redux";

import { Paper } from "@material-ui/core";

const mapStateToProps = state => ({
  hasToken: state.server.hasToken
});

class GamesHistory extends Component {
  render() {
    return (
      <div style={{ display: "inline-block" }}>
        <Paper>
          <div>Ended games archive</div>
        </Paper>
      </div>
    );
  }
}

export default connect(mapStateToProps)(GamesHistory);
