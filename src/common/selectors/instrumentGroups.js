const getTypesByTabIndex = tabIndex =>
  ({
    0: ["Stock"],
    1: ["Bond"],
    2: ["Index"],
    3: ["Commodities"],
    4: ["ETF", "MF"],
    5: ["ME", "Crypto", "ULC"],
    6: ["RE"],
    7: ["Credit"]
  }[tabIndex]);

export default getTypesByTabIndex;
