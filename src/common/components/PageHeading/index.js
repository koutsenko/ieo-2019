import React from "react";
import { Helmet } from "react-helmet";

const PageHeading = ({ children }) => (
  <Helmet>
    <title>{children}</title>
  </Helmet>
);

export default PageHeading;
