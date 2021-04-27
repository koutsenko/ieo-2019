import getTodayInstrument from "common/selectors/todayInstrument";
import chosenDayInstrument from "common/selectors/chosenDayInstrument";
import { RESIDENCE_OWN } from "common/constants/residence";

export default turnState => {
  const {
    assets,
    instruments,
    residence,
    RE_new_markup_percents,
    RE_old_discount_percents
  } = turnState;
  const { meta, names } = instruments;
  const result = assets
    .filter(a => a.type !== "current_income")
    .reduce(
      (acc, cur) => {
        const {
          id,
          count,
          start_turn,
          financialPropertyId,
          re_condition
        } = cur;
        const { type } = meta[id];
        const { name } = names[id];

        // skip own RE
        if (
          type === "RE" &&
          residence.type === RESIDENCE_OWN &&
          residence.financialPropertyId === financialPropertyId
        ) {
          return acc;
        }

        // if firm is bankrupt, dividends = 0, even if it's RE...
        const todayInstrument = getTodayInstrument(turnState, id);
        if (!todayInstrument) {
          return acc;
        }

        // check instrument - bond needs dividends got from the buy date
        let instrument;
        if (type === "Bond") {
          instrument = chosenDayInstrument(turnState, id, start_turn);
        } else {
          instrument = todayInstrument;
        }

        // get cost and calc delta
        const div1 = instrument.dividend;
        const div2 = instrument["%,dividend"];
        const { cost } = instrument;
        let delta = 0;
        if (div1 !== undefined && div1 !== "") {
          delta = parseFloat(div1) * count;
        } else if (div2 !== undefined && div2 !== "") {
          delta = (parseFloat(cost) * count * parseFloat(div2)) / 100;
        } else {
          return acc;
        }

        // if RE dividends, use condition
        if (type === "RE") {
          if (re_condition === "new") {
            delta = (delta * (100 + RE_new_markup_percents)) / 100;
          } else if (re_condition === "old") {
            delta = (delta * (100 - RE_old_discount_percents)) / 100;
          }
        }

        // result money
        const result_inner = {
          ...acc,
          money: acc.money + delta,
          dividends: [
            ...acc.dividends,
            {
              sum: delta,
              financialPropertyId,
              name
            }
          ]
        };

        return result_inner;
      },
      // turnState with empty dividends is starting point.
      { ...turnState, dividends: [] }
    );

  return result;
};
