import styles from "./index.module.css";

import React from "react";

import Balance from "client/containers/News/Heading/Balance";
import NewsHeadingLeftSide from "client/containers/News/Heading/LeftSide";
import NewsHeadingRightSide from "client/containers/News/Heading/RightSide";

const NewsHeading = ({
  orderedTurnState,
  eventsCollapsed,
  toggleEventsCollapsed,
  visible,
  setVisible
}) => (
  <div className={styles["news-heading"]}>
    <NewsHeadingLeftSide
      {...{
        eventsCollapsed,
        setVisible,
        toggleEventsCollapsed,
        visible
      }}
    />
    <Balance {...{ orderedTurnState }} />
    <NewsHeadingRightSide {...{ orderedTurnState }} />
  </div>
);

export default NewsHeading;
