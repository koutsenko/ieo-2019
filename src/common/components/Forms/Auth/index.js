import styles from "./index.module.css";

import React, { Component } from "react";

import { Grid, Paper } from "@material-ui/core";

import manLogo from "common/assets/login-man.svg";
import CustomLabel from "common/ui-kit/CustomLabel";
import CustomButton from "common/ui-kit/CustomButton";
import CustomInput from "common/ui-kit/CustomInput";

class AuthForm extends Component {
  state = {
    login: "",
    password: ""
  };

  formIsEmpty = () => {
    const { login, password } = this.state;
    const isEmpty = login.trim() === "" || password.trim() === "";

    return isEmpty;
  };

  handleChange = field => event => {
    const { value } = event.target;

    this.setState({ [field]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { handleSubmit } = this.props;

    handleSubmit(this.state);
  };

  render() {
    const { login, loginPlaceholder, password } = this.props;
    const { formIsEmpty, handleChange } = this;

    return (
      <div className={styles.container}>
        <Paper classes={{ root: styles.paper }}>
          <div className={styles.manContainer}>
            <img alt="man-logo" src={manLogo} className={styles.manLogo} />
          </div>
          <form
            className={styles.form}
            noValidate
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomLabel align="center" transparent={true}>
                  Login
                </CustomLabel>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  height="30px"
                  placeholder={loginPlaceholder}
                  value={login}
                  onChange={handleChange("login")}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomLabel align="center" transparent={true}>
                  Password
                </CustomLabel>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  height="30px"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChange("password")}
                />
              </Grid>
              <Grid item xs={6}>
                <div style={{ userSelect: "none" }}>&nbsp;</div>
              </Grid>
              <Grid item xs={6}>
                <CustomButton
                  classes={{ root: styles.submit }}
                  color="primary"
                  disabled={formIsEmpty()}
                  type="submit"
                  variant="contained"
                >
                  Sign in
                </CustomButton>
              </Grid>
              <Grid item xs={12}>
                <div className={styles.hint}>
                  <CustomLabel align="center">
                    Or use guest/guest account
                  </CustomLabel>
                </div>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

export default AuthForm;
