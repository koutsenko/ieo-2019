import { TOGGLE_EVENTS_COLLAPSED } from "client/constants/actions";

const toggleEventsCollapsed = eventsCollapsed => ({
  type: TOGGLE_EVENTS_COLLAPSED,
  eventsCollapsed
});

export default toggleEventsCollapsed;
