import styles from "./index.module.css";

import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import doLogin from "common/api/doLogin";
import toggleAuthorized from "common/actions/auth/toggleAuthorized";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import AuthForm from "common/components/Forms/Auth";
import PageContainer from "common/components/PageContainer";
import PageHeading from "common/components/PageHeading";
import { AUTH_AUTHORIZED } from "common/constants/states/auth";
import Logo from "common/components/Logo";

const mapDispatchToProps = {
  req,
  showSnackbar,
  toggleAuthorized
};

class LoginPage extends Component {
  handleSubmit = async ({ login, password }) => {
    const {
      cookies,
      history,
      req,
      showSnackbar,
      toggleAuthorized,
      tokenName
    } = this.props;

    try {
      const token = await req(doLogin(login, password));
      cookies.set(tokenName, token, { path: "/" });
      toggleAuthorized(AUTH_AUTHORIZED, login);
      history.push("/admin/dashboard");
    } catch (error) {
      showSnackbar(false, `Login error: ${error}`);
    }
  };

  render() {
    const { handleSubmit } = this;
    const loginPlaceholder = "staff";

    return (
      <PageContainer>
        <PageHeading>Login</PageHeading>
        <div className={styles.back}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.form}>
            <AuthForm
              {...{
                handleSubmit,
                loginPlaceholder
              }}
            />
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(withCookies(withRouter(LoginPage)));
