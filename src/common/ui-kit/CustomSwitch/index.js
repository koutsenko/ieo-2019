import "./index.css";
import styles from "./index.module.css";

import React from "react";

import { Switch } from "@material-ui/core";

import CustomLabel from "common/ui-kit/CustomLabel";

const CustomSwitch = ({ checked, label, onChange }) => (
  <div className={styles.container}>
    {label && <CustomLabel transparent={true}>{label}</CustomLabel>}
    <Switch
      checked={checked}
      classes={{ switchBase: styles.switchBase }}
      onChange={(event, checked) => onChange(checked)}
    />
  </div>
);

export default CustomSwitch;
