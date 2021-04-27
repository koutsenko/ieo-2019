import styles from "./index.module.css";

import React, { Component, Fragment } from "react";
import { withCookies } from "react-cookie";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Toolbar
} from "@material-ui/core";
import {
  AccountCircle,
  RadioButtonUnchecked,
  RadioButtonChecked
} from "@material-ui/icons/";

import changeFont from "common/actions/ui/changeFont";
import doLogout from "common/api/doLogout";
import revertStoreToLogin from "common/actions/system/revertStoreToLogin";
import toggleAuthorized from "common/actions/auth/toggleAuthorized";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import { AUTH_UNAUTHORIZED } from "common/constants/states/auth";
import CustomAppBar from "common/ui-kit/CustomAppBar";
import CustomAppBarButton from "common/ui-kit/CustomAppBar/Button";

const mapStateToProps = state => ({
  login: state.auth.login,
  font: state.ui.font
});

const mapDispatchToProps = {
  req,
  revertStoreToLogin,
  showSnackbar,
  toggleAuthorized,
  changeFont
};

class ToolbarMain extends Component {
  state = {
    menuOpen: false,
    fontsOpen: false
  };

  constructor(props) {
    super(props);

    this.userButtonRef = React.createRef();
  }

  toggleFonts = fontsOpen => {
    this.setState({ fontsOpen });
  };

  toggleMenu = value => () => {
    const { menuOpen } = this.state;
    const nextValue = value === undefined ? !menuOpen : value;

    this.setState({ menuOpen: nextValue });
  };

  handleLogout = async () => {
    const {
      cookies,
      history,
      loginRoute,
      req,
      revertStoreToLogin,
      showSnackbar,
      toggleAuthorized,
      tokenName
    } = this.props;

    try {
      await req(doLogout());
      cookies.remove(tokenName);
      toggleAuthorized(AUTH_UNAUTHORIZED);
      revertStoreToLogin();
      history.push(loginRoute);
    } catch (error) {
      this.toggleMenu(false)();
      showSnackbar(false, `Logout error: ${error}`);
    }
  };

  render() {
    const { fontsOpen, menuOpen } = this.state;
    const { children, font, login, disabled } = this.props;

    return (
      <Fragment>
        <CustomAppBar position="sticky">
          <Toolbar classes={{ root: styles.toolbar }}>
            <div className={styles.container}>{children}</div>
            <div style={{ height: "inherit" }}>
              <CustomAppBarButton
                buttonRef={this.userButtonRef}
                onClick={this.toggleMenu()}
                classes={{ root: styles.button }}
              >
                <AccountCircle />
                <span style={{ paddingLeft: "0.5em", textTransform: "none" }}>
                  {login}
                </span>
              </CustomAppBarButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.userButtonRef.current}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={menuOpen}
                onClose={this.toggleMenu(false)}
              >
                <MenuItem
                  onClick={() => {
                    this.toggleMenu(false)();
                    this.toggleFonts(true);
                  }}
                >
                  Fonts
                </MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
            {disabled && <div className={styles.disabled}>&nbsp;</div>}
          </Toolbar>
        </CustomAppBar>
        {fontsOpen && (
          <Dialog
            open={true}
            BackdropProps={{
              classes: {
                root: styles.fontsDialogBackdrop
              }
            }}
          >
            <DialogContent>
              <div style={{ display: "flex" }}>
                <RadioGroup
                  value={font.fontFamily}
                  onChange={event => {
                    const { changeFont } = this.props;
                    const { value } = event.target;

                    changeFont({
                      ...font,
                      fontFamily: value
                    });
                  }}
                >
                  {[
                    "B612 Mono",
                    "Inconsolata",
                    "Roboto Mono",
                    "PT Mono",
                    "Ubuntu Mono",
                    "Source Code Pro",
                    "Cousine",
                    "VT323",
                    "Share Tech Mono",
                    "Nanum Gothic Coding",
                    "Space Mono",
                    "Fira Mono",
                    "Anonymous Pro",
                    "IBM Plex Mono",
                    "Oxygen Mono",
                    "Overpass Mono",
                    "Major Mono Display",
                    "Cutive Mono",
                    "Nova Mono"
                  ].map(f => (
                    <FormControlLabel
                      key={f}
                      value={f}
                      control={
                        <Radio
                          icon={<RadioButtonUnchecked fontSize="small" />}
                          checkedIcon={<RadioButtonChecked fontSize="small" />}
                        />
                      }
                      label={f}
                    />
                  ))}
                </RadioGroup>
                <RadioGroup
                  value={font.fontSpacing}
                  onChange={event => {
                    const { changeFont } = this.props;
                    const { value } = event.target;

                    changeFont({
                      ...font,
                      fontSpacing: value
                    });
                  }}
                >
                  {[
                    "-1px",
                    "-0.75px",
                    "-0.5px",
                    "-0.25px",
                    "0px",
                    "0.25px",
                    "0.5px",
                    "0.75px",
                    "1px"
                  ].map(f => (
                    <FormControlLabel
                      key={f}
                      value={f}
                      control={
                        <Radio
                          icon={<RadioButtonUnchecked fontSize="small" />}
                          checkedIcon={<RadioButtonChecked fontSize="small" />}
                        />
                      }
                      label={f}
                    />
                  ))}
                </RadioGroup>
                <RadioGroup
                  value={font.fontWeight}
                  onChange={event => {
                    const { changeFont } = this.props;
                    const { value } = event.target;

                    changeFont({
                      ...font,
                      fontWeight: value
                    });
                  }}
                >
                  {["300", "normal", "500", "bold"].map(f => (
                    <FormControlLabel
                      key={f}
                      value={f}
                      control={
                        <Radio
                          icon={<RadioButtonUnchecked fontSize="small" />}
                          checkedIcon={<RadioButtonChecked fontSize="small" />}
                        />
                      }
                      label={f}
                    />
                  ))}
                </RadioGroup>
                <RadioGroup
                  value={font.fontSize}
                  onChange={event => {
                    const { changeFont } = this.props;
                    const { value } = event.target;

                    changeFont({
                      ...font,
                      fontSize: value
                    });
                  }}
                >
                  {[
                    "8px",
                    "9px",
                    "10px",
                    "11px",
                    "12px",
                    "13px",
                    "14px",
                    "15px",
                    "16px"
                  ].map(f => (
                    <FormControlLabel
                      key={f}
                      value={f}
                      control={
                        <Radio
                          icon={<RadioButtonUnchecked fontSize="small" />}
                          checkedIcon={<RadioButtonChecked fontSize="small" />}
                        />
                      }
                      label={f}
                    />
                  ))}
                </RadioGroup>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.toggleFonts(false)}>Закрыть</Button>
            </DialogActions>
          </Dialog>
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCookies(withRouter(ToolbarMain)));
