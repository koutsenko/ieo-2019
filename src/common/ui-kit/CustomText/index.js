import React from "react";

import CustomLabel from "common/ui-kit/CustomLabel";

const CustomText = props => (
  <CustomLabel {...{ ...props, align: "left" }}></CustomLabel>
);

export default CustomText;
