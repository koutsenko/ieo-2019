import React, { Component } from "react";

import { Grid } from "@material-ui/core";

import CustomCheckbox from "common/ui-kit/CustomCheckbox";
import CustomInput from "common/ui-kit/CustomInput";
import CustomSwitch from "common/ui-kit/CustomSwitch";
import CustomLabel from "common/ui-kit/CustomLabel";

class UIKitControlsDemo extends Component {
  state = {
    checkbox: false,
    myswitch: true,
    text: "type me",
    text2: "error text"
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = field => value => {
    this.setState({ [field]: value });
  };

  render() {
    const { checkbox, myswitch, text, text2 } = this.state;

    return (
      <Grid alignItems="baseline" container spacing={1}>
        <Grid item xs={4}>
          <CustomLabel>Checkbox</CustomLabel>
        </Grid>
        <Grid item xs={8}>
          <CustomCheckbox
            {...{
              checked: checkbox,
              label: "demo",
              onChange: this.handleChange("checkbox")
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomLabel>Checkbox disabled</CustomLabel>
        </Grid>
        <Grid item xs={8}>
          <CustomCheckbox
            {...{
              checked: checkbox,
              disabled: true,
              label: "demo",
              onChange: this.handleChange("checkbox")
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomLabel>Input</CustomLabel>
        </Grid>
        <Grid item xs={8}>
          <CustomInput
            {...{
              value: text,
              onChange: event => this.handleChange("text")(event.target.value)
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomLabel>Input error</CustomLabel>
        </Grid>
        <Grid item xs={8}>
          <CustomInput
            {...{
              error: true,
              value: text2,
              onChange: event => this.handleChange("text2")(event.target.value)
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomLabel>Switch</CustomLabel>
        </Grid>
        <Grid item xs={8}>
          <CustomSwitch
            {...{
              checked: myswitch,
              label: "demo",
              onChange: this.handleChange("myswitch")
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default UIKitControlsDemo;
