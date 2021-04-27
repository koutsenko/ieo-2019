import styles from "./index.module.css";

import React from "react";

const PageContainer = ({ children }) => (
  <div className={styles["page-container"]}>{children}</div>
);

export default PageContainer;
