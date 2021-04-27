const cols3 = ["25%", "40%", "35%"];
const cols4 = ["25%", "35%", "25%", "15%"];
const cols5 = ["25%", "15%", "20%", "20%", "20%"];
const cols6 = ["25%", "15%", "15%", "15%", "15%", "15%"];

const buildColumnWidth = type => {
  const map = {
    Bond: cols6,
    Commodities: cols5,
    Credit: cols3,
    ETF: cols6,
    Index: cols5,
    ME: cols6,
    RE: cols4,
    Stock: cols6
  };
  const result = map[type];

  return result;
};

export default buildColumnWidth;
