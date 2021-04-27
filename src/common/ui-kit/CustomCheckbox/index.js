import styles from "./index.module.css";

import React from "react";

import { Checkbox } from "@material-ui/core";

import CustomLabel from "common/ui-kit/CustomLabel";

const CustomCheckbox = ({ checked, disabled, label, onChange }) => (
  <div className={styles.container}>
    {label && (
      <CustomLabel color={disabled ? "gray" : null} transparent={true}>
        {label}
      </CustomLabel>
    )}
    <Checkbox
      checked={checked}
      classes={{ disabled: styles.disabled, root: styles.root }}
      disabled={disabled}
      onChange={disabled ? null : (event, checked) => onChange(checked)}
    />
  </div>
);

export default CustomCheckbox;
