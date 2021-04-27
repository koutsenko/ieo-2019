export default (turnState, state) => {
  const nextTurnState = { ...turnState };

  const { scenario } = state;
  const { globalParams } = scenario;
  const re_decay_speed = parseInt(globalParams["RE decay speed"], 10);
  const { turn } = nextTurnState;

  nextTurnState.assets = nextTurnState.assets.reduce((acc, cur) => {
    const { re_condition_last_update_turn, type } = cur;
    const result = [
      ...acc,
      type === "RE" && re_condition_last_update_turn + re_decay_speed === turn
        ? {
            ...cur,
            re_condition: {
              new: "normal",
              normal: "old",
              old: "old"
            }[cur.re_condition],
            re_condition_last_update_turn: turn
          }
        : cur
    ];

    return result;
  }, []);

  return nextTurnState;
};
