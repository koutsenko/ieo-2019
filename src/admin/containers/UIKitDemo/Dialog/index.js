import React, { Component, Fragment } from "react";

import CustomButton from "common/ui-kit/CustomButton";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomText from "common/ui-kit/CustomText";

class UIKitDialogDemo extends Component {
  state = {
    open: false
  };

  toggleOpen = open => () => {
    this.setState({ open });
  };

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <CustomButton onClick={this.toggleOpen(true)}>Show</CustomButton>
        {open && (
          <CustomDialog
            {...{
              actions: {
                Close: this.toggleOpen(false)
              },
              content: (
                <div>
                  <CustomText>Demo dialog content</CustomText>
                </div>
              ),
              title: "Demo dialog"
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default UIKitDialogDemo;
