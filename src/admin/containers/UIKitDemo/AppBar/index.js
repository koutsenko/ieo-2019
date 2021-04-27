import styles from "./index.module.css";

import React from "react";

import { Toolbar, Typography } from "@material-ui/core";

import CustomAppBar from "common/ui-kit/CustomAppBar";
import CustomAppBarButton from "common/ui-kit/CustomAppBar/Button";

const UIKitAppBarDemo = () => (
  <CustomAppBar position="relative">
    <Toolbar classes={{ root: styles.toolbar }}>
      <Typography>Toolbar</Typography>
      <CustomAppBarButton color="primary" onClick={() => console.log("click")}>
        Test button
      </CustomAppBarButton>
    </Toolbar>
  </CustomAppBar>
);

export default UIKitAppBarDemo;
