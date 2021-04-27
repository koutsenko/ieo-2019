const buildCredit = (
  id,
  type,
  principal,
  years,
  percent,
  financialPropertyId,
  props
) => {
  const p = parseInt(percent.split("%")[0], 10) / 100;
  const periodic_payment =
    Math.round(
      (principal * 100 * (p * Math.pow(1 + p, years))) /
        (Math.pow(1 + p, years) - 1)
    ) / 100;

  const principal_remaining = principal;
  let credit = {
    id,
    financialPropertyId,
    type,
    principal,
    principal_remaining,
    years,
    years_remaining: years,
    percent,
    periodic_payment /* То что по графику надо платить каждый год, фикс. сумма */
  };

  if (props !== undefined && typeof props === "object") {
    credit = {
      ...credit,
      ...props
    };
  }

  return credit;
};

export default buildCredit;
