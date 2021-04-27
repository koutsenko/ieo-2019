/**
 * Это я надеюсь мы сможем перекрасить
 */

import styles from "./index.module.css";

import React, { Component } from "react";

import { Select } from "@material-ui/core";

import CustomMenuItem from "common/ui-kit/CustomMenu/Item";

class CustomSelect extends Component {
  render() {
    const { handleChange, value, values } = this.props;

    return (
      <Select
        fullWidth={true}
        classes={{
          root: styles.root,
          select: styles.select
        }}
        disableUnderline={true}
        MenuProps={{
          classes: { paper: styles.menu }
        }}
        onChange={handleChange}
        value={value}
      >
        {values.map(v => (
          <CustomMenuItem key={v} value={v}>
            {v}
          </CustomMenuItem>
        ))}
      </Select>
    );
  }
}
export default CustomSelect;
