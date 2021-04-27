import { TOGGLE_DEMIURG_COLLAPSED } from "client/constants/actions";

const toggleDemiurgCollapsed = demiurgCollapsed => ({
  type: TOGGLE_DEMIURG_COLLAPSED,
  demiurgCollapsed
});

export default toggleDemiurgCollapsed;
