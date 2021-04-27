import viewCreditPeriods from "common/calc/viewCreditPeriods";

const viewRemainingPercents = (credit, start_from_year) => {
  const { years, principal, percent } = credit;
  const periods = viewCreditPeriods(0, years, credit, principal, percent);
  const remainingInterest = periods.reduce((acc, cur, index) => {
    let result = acc;

    if (index >= start_from_year) {
      result = result + cur[3];
    }

    return result;
  }, 0);

  return remainingInterest;
};

export default viewRemainingPercents;
