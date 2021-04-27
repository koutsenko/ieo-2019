import styles from "./index.module.css";

import React from "react";

import { AppBar } from "@material-ui/core";

const CustomAppBar = props => (
  <AppBar
    classes={{
      root: styles.main
    }}
    {...{ ...props }}
  />
);

export default CustomAppBar;
