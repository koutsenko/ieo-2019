const buildBond = (id, start_turn, end_turn, financialPropertyId, count) => {
  const type = "Bond";
  const bond = {
    id,
    financialPropertyId,
    type,
    start_turn,
    end_turn,
    count: parseFloat(count)
  };

  return bond;
};

export default buildBond;
