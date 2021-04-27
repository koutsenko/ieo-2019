import React, { Component } from "react";
import { connect } from "react-redux";

import { Button } from "@material-ui/core";

import toggleDemiurgCollapsed from "client/actions/toggleDemiurgCollapsed";

const mapStateToProps = state => ({ toggled: state.uiclient.demiurgCollapsed });

const mapDispatchToProps = {
  toggleDemiurgCollapsed
};

class BarToggler extends Component {
  render() {
    const { toggled, toggleDemiurgCollapsed } = this.props;

    return (
      <Button
        onClick={() => {
          toggleDemiurgCollapsed(!toggled);
        }}
      >
        {toggled ? "<<" : ">>"}
      </Button>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarToggler);
