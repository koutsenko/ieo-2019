import viewCreditPeriods from "common/calc/viewCreditPeriods";

/**
 * Метод подсчета полной суммы кредита (ПСК).
 * Исходит из principal_remaining years_remaining.
 * Работает даже на выплате остатка (years_remaining = 0).
 *
 * Нужен чтобы знать сколько всего осталось выплат.
 * ПСК в механике не задействована и нужна только человеку.
 */
const getFullCreditSum = credit => {
  const { percent, principal_remaining, years_remaining } = credit;
  const periods = viewCreditPeriods(
    0,
    years_remaining,
    credit,
    principal_remaining,
    percent
  );
  const full_interest_remaining = periods.reduce((acc, cur) => acc + cur[3], 0);
  const sum_remaining = principal_remaining + full_interest_remaining;

  return sum_remaining;
};

export default getFullCreditSum;
