import nanoid from "nanoid";

import { RESIDENCE_RENTAL_CHEAT } from "common/constants/residence";
import { createISOnow } from "common/utils/dates";

export default store => socketId => {
  const state = store.getState();
  const { auth, scenario } = state;
  const {
    coeffs,
    events,
    globalParams,
    instruments,
    taxrates,
    mortgageLoanCosts,
    leverageCreditCosts
  } = scenario;
  const { demiurg, name } = auth[socketId];

  // acesss scenario global params
  const s = {
    can_replay: globalParams["can replay"],
    RE_new_markup: globalParams["RE new markup"],
    RE_old_discount: globalParams["RE old discount"],
    RE_min_dp: globalParams["RE min dp"],
    game_end_period: globalParams["game end period"],
    game_start_period: globalParams["game start period"],
    income: globalParams["income"],
    start_money: globalParams["start money"],
    retirement_pension: globalParams["retirement pension"],
    retirement_period: globalParams["retirement period"],
    history_start_period: globalParams["history start period"],
    life_cost: globalParams["life cost"],
    rental_cheat_cost: globalParams["rental cheat cost"],
    default_instr_digits: globalParams["default instr digits"],
    scenario_name: globalParams["scenario name"],
    bonds_discount: globalParams["bonds discount"],
    margin_call_level: globalParams["margin call level"]
  };

  // game start period
  const gameStartPeriod = parseInt(s.game_start_period, 10);

  // game end period
  const gameEndPeriod = parseInt(s.game_end_period, 10);

  // history start period
  const historyStartPeriod = parseInt(s.history_start_period, 10);

  // current income
  const income_k_raw = coeffs.coeffIncome[gameStartPeriod - 1];
  const income_k = income_k_raw === "" ? 1 : parseFloat(income_k_raw);
  const income = parseInt(s.income, 10) * income_k;

  // current life cost
  const lc_k_raw = coeffs.coeffLifeCost[gameStartPeriod - 1];
  const lc_k = lc_k_raw === "" ? 1 : parseFloat(lc_k_raw);
  const lifecost = parseInt(s.life_cost.split("%")[0], 10) * lc_k;

  // tax rate
  const taxrate = taxrates[gameStartPeriod - 1];

  // current rental
  const r_k_raw = coeffs.coeffRent[gameStartPeriod - 1];
  const r_k = r_k_raw === "" ? 1 : parseFloat(r_k_raw);
  const rental = parseInt(s.rental_cheat_cost, 10) * r_k;

  // current leverageCreditCost
  const currentLeverageCreditCost = leverageCreditCosts[gameStartPeriod - 1];

  // current mortgageLoanCost
  const currentMortgageLoanCost = mortgageLoanCosts[gameStartPeriod - 1];

  // money
  const money = parseInt(s.start_money, 10);

  // retirement period
  const retirementPeriod = parseInt(s.retirement_period, 10);

  // retirement pension
  const retirementPension = parseInt(s.retirement_pension, 10);

  // reserved funds: current_life
  const reservedFundsCurrentLife = (income * lifecost) / 100;

  // reserved funds: current taxes
  const reservedFundsCurrentTaxes = income * taxrate;

  // reserved funds: rental
  const reservedFundsRental = rental;

  // params for digits rendering
  const defaultInstrDigits = parseInt(s.default_instr_digits, 10);

  // discount for manual bonds closing
  // FIXME почему сразу не преобразую строку в число с плав. запятой?
  const bonds_discount_percents = s.bonds_discount.split("%")[0];

  // additional RE info
  const RE_new_markup_percents = parseFloat(s.RE_new_markup.split("%")[0]);
  const RE_old_discount_percents = parseFloat(s.RE_old_discount.split("%")[0]);
  const RE_min_dp_percents = parseFloat(s.RE_min_dp.split("%")[0]);

  // mc level
  const margin_call_level_k =
    parseFloat(s.margin_call_level.split("%")[0]) / 100;

  // can_replay
  const can_replay = !!+s.can_replay;

  const turnState = {
    can_replay,
    residence: {
      type: RESIDENCE_RENTAL_CHEAT
    },
    margin_call_last_data: null,
    margin_call_level_k,
    RE_new_markup_percents,
    RE_old_discount_percents,
    RE_min_dp_percents,
    scenario_name: s.scenario_name,
    assets: [
      {
        financialPropertyId: nanoid(),
        type: "current_income",
        value: income
      }
    ],
    bonds_discount_percents,
    avgBuyCosts: {},
    defaultInstrDigits,
    demiurg,
    game_id: nanoid(),
    game_start_time: createISOnow(),
    name,
    gameEndPeriod,
    gameStartPeriod,
    historyStartPeriod,
    events,
    instruments,
    reservedCapital: 0, // для расчета возможности взять плечо (а потом и для маржин кола)
    liabilities: [
      {
        financialPropertyId: nanoid(),
        type: "current_life",
        value: `${lifecost}%`
      },
      {
        financialPropertyId: nanoid(),
        type: "current_tax_rate",
        value: taxrate
      },
      {
        financialPropertyId: nanoid(),
        type: "rental",
        value: rental
      }
    ],
    money,
    orders: [],
    reservedFunds: [
      {
        type: "current_tax_rate",
        value: reservedFundsCurrentTaxes
      },
      {
        type: "rental",
        value: reservedFundsRental
      },
      {
        type: "current_life",
        value: reservedFundsCurrentLife
      },
      {
        type: "leverage_payment",
        value: 0
      }
    ],
    dividends: [],
    expiredBonds: [],
    retirementPeriod,
    retirementPension,
    turn: 1,
    currentMortgageLoanCost,
    currentLeverageCreditCost,
    closedCredits: []
  };

  return turnState;
};
