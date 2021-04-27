import buildBondColumnData from "client/containers/Actions/InstrumentList/ColumnData/Bond";
import buildCommoditiesColumnData from "client/containers/Actions/InstrumentList/ColumnData/Commodities";
import buildCreditColumnData from "client/containers/Actions/InstrumentList/ColumnData/Credit";
import buildCryptoColumnData from "client/containers/Actions/InstrumentList/ColumnData/Crypto";
import buildETFColumnData from "client/containers/Actions/InstrumentList/ColumnData/ETF";
import buildIndexColumnData from "client/containers/Actions/InstrumentList/ColumnData/Indexes";
import buildMEColumnData from "client/containers/Actions/InstrumentList/ColumnData/ME";
import buildMFColumnData from "client/containers/Actions/InstrumentList/ColumnData/MF";
import buildREColumnData from "client/containers/Actions/InstrumentList/ColumnData/RE";
import buildStockColumnData from "client/containers/Actions/InstrumentList/ColumnData/Stock";
import buildULCColumnData from "client/containers/Actions/InstrumentList/ColumnData/ULC";

const buildColumnData = ({ type, data }) => {
  const fn = {
    Bond: buildBondColumnData,
    Commodities: buildCommoditiesColumnData,
    Credit: buildCreditColumnData,
    Crypto: buildCryptoColumnData,
    ETF: buildETFColumnData,
    Index: buildIndexColumnData,
    ME: buildMEColumnData,
    MF: buildMFColumnData,
    RE: buildREColumnData,
    Stock: buildStockColumnData,
    ULC: buildULCColumnData
  }[type];
  const result = fn({ data });

  return result;
};

export default buildColumnData;
