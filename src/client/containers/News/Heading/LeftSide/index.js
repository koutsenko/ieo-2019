import styles from "./index.module.css";

import React from "react";

import { Typography } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";

import CustomCheckbox from "common/ui-kit/CustomCheckbox";

const NewsHeadingLeftSide = ({
  eventsCollapsed,
  toggleEventsCollapsed,
  visible,
  setVisible
}) => (
  <div className={styles.container}>
    <div
      className={styles["news-button"]}
      onClick={() => {
        toggleEventsCollapsed();
      }}
    >
      <div className={styles["news-button-inner"]}>
        <Typography variant="h5">News</Typography>
        {!eventsCollapsed ? <ArrowDropDown /> : <ArrowDropUp />}
      </div>
    </div>
    <div className={styles.filters}>
      <CustomCheckbox
        {...{
          checked: visible.global,
          label: "Global",
          onChange: value => setVisible({ ...visible, global: value })
        }}
      />
      <CustomCheckbox
        {...{
          checked: visible.instrument,
          disabled: true,
          label: "Instrument",
          onChange: value => setVisible({ ...visible, instrument: value })
        }}
      />
      <CustomCheckbox
        {...{
          checked: visible.personal,
          label: "Personal",
          onChange: value => setVisible({ ...visible, personal: value })
        }}
      />
    </div>
  </div>
);

export default NewsHeadingLeftSide;
