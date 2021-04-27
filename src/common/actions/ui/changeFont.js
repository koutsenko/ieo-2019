import { SET_FONT } from "common/constants/actions";

const changeFont = font => ({
  type: SET_FONT,
  font
});

export default changeFont;
