const buildColumnNames = type =>
  ({
    Bond: [
      "Name",
      "Current price",
      "Coupon",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    Commodities: [
      "Name",
      "Current price",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    Credit: ["Name", "Interest rate, %", "Years"],
    Crypto: [
      "Name",
      "Current price",
      "Dividends",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    ETF: [
      "Name",
      "Current price",
      "All time yields",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    Index: [
      "Name",
      "Current price",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    ME: [
      "Name",
      "Current price",
      "Dividends",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    MF: [
      "Name",
      "Current price",
      "All time yields",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    RE: ["Name", "Current price (normal)", "Rental cost", ""],
    Stock: [
      "Name",
      "Current price",
      "Dividends",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ],
    ULC: [
      "Name",
      "Current price",
      "Dividends",
      "Quantity on hand",
      "Avg buy price",
      "Total value"
    ]
  }[type]);

export default buildColumnNames;
