import { SHOW_SNACKBAR } from "common/constants/actions";

const showSnackbar = (success, message) => ({
  type: SHOW_SNACKBAR,
  success,
  message
});

export default showSnackbar;
