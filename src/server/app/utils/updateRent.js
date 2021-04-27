import {
  RESIDENCE_RENTAL,
  RESIDENCE_RENTAL_CHEAT,
  RESIDENCE_OWN
} from "common/constants/residence";
import getTodayInstrument from "common/selectors/todayInstrument";

// FIXME опять опасный код. Надо делать в reduce, как для applyTurn.
export default (turnState, state) => {
  let nextTurnState = { ...turnState };

  const { turn, instruments, gameStartPeriod } = nextTurnState;
  const { history, meta } = instruments;
  const { scenario } = state;
  const { coeffs, globalParams } = scenario;

  const rental_cheat_cost = parseInt(globalParams["rental cheat cost"], 10);
  const rental_cheat_years = parseInt(globalParams["rental cheat years"], 10);

  // FIXME возможно надо съехать если хата исчезла с рынка. пока в сценарии заполнил всё

  // Рассчитываем условия возможного переезда
  let nextFlat = null;
  if (nextTurnState.residence.type === RESIDENCE_RENTAL_CHEAT) {
    if (turn > rental_cheat_years) {
      // Список всех квартир
      const flat_ids = Object.keys(meta).filter(key => meta[key].type === "RE");

      // Год за который считывать инфу
      const year = turn + gameStartPeriod - 1;

      // Список квартир доступных (непустой dividends) в этом году
      const available_flats = flat_ids.reduce((acc, cur) => {
        const flat = getTodayInstrument(nextTurnState, cur);
        const result =
          flat === undefined
            ? acc
            : [
                ...acc,
                {
                  id: flat.id,
                  dividend: parseFloat(flat.dividend)
                }
              ];

        return result;
      }, []);

      // Выселяем, если есть жилье на рынке
      if (available_flats.length !== 0) {
        // Самая дешевая (по ставке за нормальную! у нас пока нет возможности снять старую/новую...)
        const cheapest = available_flats.sort(
          (a, b) => a.dividend - b.dividend
        );

        // nextFlat
        nextFlat = cheapest[0];
      }
    }
  }

  // Осуществляем переезд если надо
  if (nextFlat !== null) {
    nextTurnState = {
      ...nextTurnState,
      residence: {
        type: RESIDENCE_RENTAL,
        id: nextFlat.id
      }
    };
  }

  // Коэффициент ренты (в параметрах сценария)
  const index = nextTurnState.gameStartPeriod + turn - 1 - 1;
  const rent_k_raw = coeffs.coeffRent[index];
  const rent_k = rent_k_raw === "" ? 1 : parseFloat(rent_k_raw);

  // Рассчитываем текущую стоимость ренты
  let rent;
  const { type } = nextTurnState.residence;
  if (type === RESIDENCE_OWN) {
    rent = 0;
  } else if (type === RESIDENCE_RENTAL_CHEAT) {
    rent = rental_cheat_cost * rent_k;
  } else if (type === RESIDENCE_RENTAL) {
    // Год за который считывать инфу
    const { dividend } = getTodayInstrument(
      nextTurnState,
      nextTurnState.residence.id
    );

    rent = parseFloat(dividend) * rent_k;
  }

  // FIXME стоимость ренты я обновил. А где reserved funds?
  const result = {
    ...nextTurnState,
    liabilities: nextTurnState.liabilities.reduce((acc, cur) => {
      let result;

      if (cur.type === "rental") {
        result = [
          ...acc,
          {
            ...cur,
            value: rent
          }
        ];
      } else {
        result = [...acc, cur];
      }

      return result;
    }, [])
  };

  return result;
};
