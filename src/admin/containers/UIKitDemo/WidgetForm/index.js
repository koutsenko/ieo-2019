import React, { Component } from "react";

import { Grid } from "@material-ui/core";

import CustomButton from "common/ui-kit/CustomButton";
import CustomInput from "common/ui-kit/CustomInput";
import CustomLabel from "common/ui-kit/CustomLabel";
import CustomSelect from "common/ui-kit/CustomSelect";
import CustomText from "common/ui-kit/CustomText";

class UIKitWidgetFormDemo extends Component {
  render() {
    return (
      <form>
        <Grid alignItems="stretch" container spacing={1}>
          {/* row 1 */}
          <Grid item xs={3}>
            <CustomLabel>Just a field</CustomLabel>
          </Grid>
          <Grid item xs={3}>
            <CustomInput />
          </Grid>
          <Grid item xs={6}>
            &nbsp;
          </Grid>
          {/* row 2 */}
          <Grid item xs={3}>
            <CustomLabel>Just a field</CustomLabel>
          </Grid>
          <Grid item xs={3}>
            <CustomInput />
          </Grid>
          <Grid item xs={3}>
            <CustomLabel>Another field</CustomLabel>
          </Grid>
          <Grid item xs={3}>
            <CustomInput />
          </Grid>
          {/* row 3 */}
          <Grid item xs={3}>
            <CustomLabel>Choice</CustomLabel>
          </Grid>
          <Grid item xs={3}>
            <CustomSelect
              value="normal"
              handleChange={() => {
                console.log("change");
              }}
              values={["new", "normal", "old"]}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomLabel>Info</CustomLabel>
          </Grid>
          <Grid item xs={3}>
            <CustomText>Something info</CustomText>
          </Grid>
          {/* row 4 */}
          <Grid item xs={3}>
            &nbsp;
          </Grid>
          <Grid item xs={3}>
            <CustomButton fullWidth disabled={true}>
              Demo button disabled
            </CustomButton>
          </Grid>
          <Grid item xs={3}>
            <CustomButton fullWidth>Demo button 1</CustomButton>
          </Grid>
          <Grid item xs={3}>
            <CustomButton fullWidth>Demo button 2</CustomButton>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default UIKitWidgetFormDemo;
