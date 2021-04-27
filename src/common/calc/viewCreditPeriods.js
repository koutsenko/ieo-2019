const viewCreditPeriods = (turn, years, credit, principal, percent) => {
  const result =
    principal === 0
      ? []
      : Array(years + 1)
          .fill(null)
          .reduce((acc, cur, index, arr) => {
            let result = [...acc];
            let prev = acc[index - 1];

            const isRest = index === arr.length - 1;
            const total_payment = isRest ? prev[5] : credit.periodic_payment;
            const interest_payment = isRest
              ? 0
              : ((index === 0 ? principal : prev[5]) * percent) / 100;
            const principal_payment = total_payment - interest_payment;
            const principal_balance =
              (index === 0 ? principal : prev[5]) - principal_payment;

            result.push([
              index + 1,
              `Year ${turn + 1 + index}${isRest ? " (rest)" : ""}`,
              total_payment,
              interest_payment,
              principal_payment,
              principal_balance
            ]);

            return result;
          }, []);

  return result;
};

export default viewCreditPeriods;
