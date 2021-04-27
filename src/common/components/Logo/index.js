import styles from "./index.module.css";

import React from "react";

import logo from "common/assets/ieo-logo.svg";

const Logo = () => (
  <div className={styles.logo}>
    <img alt="logo" src={logo} />
  </div>
);

export default Logo;
