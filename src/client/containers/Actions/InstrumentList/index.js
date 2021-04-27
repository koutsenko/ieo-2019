import * as R from "ramda";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import CustomMenu from "common/ui-kit/CustomMenu";
import CustomTable from "common/ui-kit/CustomTable";

import buildColumnData from "client/containers/Actions/InstrumentList/ColumnData";
import buildColumnNames from "client/containers/Actions/InstrumentList/ColumnNames";
import buildColumnWidth from "client/containers/Actions/InstrumentList/ColumnWidth";
import loadTurn from "client/actions/loadTurn";
import doOrder from "client/actions/order";
import req from "common/actions/socket/req";
import showSnackbar from "common/actions/ui/showSnackbar";
import { CHANGE_RESIDENCE } from "common/constants/orders";
import getTodayInstrument from "common/selectors/todayInstrument";

const displayName = name => {
  const result =
    {
      ME: "Insurance"
    }[name] || name;

  return result;
};

const mapStateToProps = (state, ownProps) => {
  const { orderedTurnState } = state.game;
  const { types } = ownProps;
  const { meta, history, names } = orderedTurnState.instruments;
  const groups = types.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: R.pickBy(i => i.type === cur, meta) // meta subset for each instrument type
    }),
    {}
  );

  return { orderedTurnState, groups, history, names };
};

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

class InstrumentList extends Component {
  state = {
    menuData: null
  };

  constructor(props) {
    super(props);

    this.menuHandler = this.menuHandler.bind(this);
  }

  componentDidMount() {
    this.selectFirst();
  }

  componentDidUpdate(prevProps) {
    const { orderedTurnState, selectedInstrument } = this.props;
    const { turn } = orderedTurnState;

    const prevKeys = Object.keys(prevProps.groups);
    const currKeys = Object.keys(this.props.groups);
    const tabChanged = JSON.stringify(prevKeys) !== JSON.stringify(currKeys);
    const turnChanged = prevProps.orderedTurnState.turn !== turn;
    const notSelectedOrSelectedButDropped =
      [undefined, null].includes(selectedInstrument) ||
      !getTodayInstrument(orderedTurnState, selectedInstrument.id);

    if (tabChanged || (turnChanged && notSelectedOrSelectedButDropped)) {
      this.selectFirst();
    }
  }

  handleChangeResidence = async id => {
    const { req, showSnackbar, loadTurn } = this.props;
    const action = CHANGE_RESIDENCE;
    const order = doOrder({ action, id });

    try {
      loadTurn(await req(order));
      showSnackbar(true, "Action successful");
    } catch (error) {
      showSnackbar(false, `Action error: ${error}`);
    }
  };

  /**
   * Обработчик клика на троеточие.
   */
  menuHandler(event, id) {
    const { orderedTurnState } = this.props;
    const { type } = orderedTurnState.instruments.meta[id];
    const { target } = event;

    this.setState({
      menuData: { id, target, type }
    });
  }

  /**
   * Все инструменты на витрине представлены ключом id.
   * За исключением кредитов, которые размазаны на несколько строк.
   * У них id___range.
   */
  buildSelectionKey(data) {
    const keys = Object.keys(data);
    const result =
      keys.length === 1 ? `${data.id}` : `${data.id}___${data.range}`;

    return result;
  }

  /**
   * Все инструменты на витрине представлены ключом id.
   * За исключением кредитов, которые размазаны на несколько строк.
   * У них id___range.
   */
  parseSelectionKey(key) {
    const parts = key.split("___");
    const result =
      parts.length === 1 ? { id: parts[0] } : { id: parts[0], range: parts[1] };

    return result;
  }

  selectFirst() {
    const { groups, onClick, orderedTurnState } = this.props;
    const { instruments } = orderedTurnState;
    const { meta } = instruments;
    let instrument = null;
    let selectedInstrument = null;

    const allIds = Object.keys(groups).reduce(
      (acc, cur) => [...acc, ...Object.keys(groups[cur])],
      []
    );

    for (let i = 0; i < allIds.length; i++) {
      instrument = getTodayInstrument(orderedTurnState, allIds[i]);
      if (instrument) {
        break;
      }
    }

    if (instrument) {
      const { id } = instrument;
      const { params, type } = meta[id];
      selectedInstrument = { id };
      if (type === "Credit") {
        selectedInstrument.range = params[0];
      }
    }

    onClick(selectedInstrument)();
  }

  /**
   * Вспомогательный метод, чтобы упростить логику отрисовки (есть или нет корневой узел).
   */
  buildChildren(k, ids, groups, orderedTurnState, menuHandler) {
    return k === "Credit"
      ? ids.reduce((acc, cur) => {
          const credit = groups["Credit"][cur];
          const { type } = orderedTurnState.instruments.meta[cur];
          const { name } = orderedTurnState.instruments.names[cur];
          const rows = credit.params
            .map(range =>
              buildColumnData({
                type,
                data: {
                  id: cur,
                  orderedTurnState,
                  range,
                  name,
                  menuHandler
                }
              })
            )
            .filter(r => r !== null); // фильтр на особенности парсинга кредитов где не все колонки заполнены
          const result = [...acc, ...rows];

          return result;
        }, [])
      : ids.map(id => {
          const { type } = orderedTurnState.instruments.meta[id];
          const { name } = orderedTurnState.instruments.names[id];
          const row = buildColumnData({
            type,
            data: { id, orderedTurnState, name, menuHandler }
          });

          return row;
        });
  }

  buildChildKeys(k, ids, groups) {
    return k === "Credit"
      ? ids.reduce((acc, cur) => {
          const credit = groups["Credit"][cur];
          const rows = credit.params
            .filter(r => r !== null) // фильтр на особенности парсинга кредитов где не все колонки заполнены
            .map(r => `${cur}___${r}`);
          const result = [...acc, ...rows];

          return result;
        }, [])
      : ids;
  }

  buildMarketItems() {
    const { orderedTurnState, selectedInstrument, groups } = this.props;
    const { menuHandler } = this;
    const groupKeys = Object.keys(groups);
    const cols = buildColumnNames(groupKeys[0]);
    const colWidth = buildColumnWidth(groupKeys[0]);

    let data = [];
    let keys = [];

    for (var i = 0; i < groupKeys.length; i++) {
      const k = groupKeys[i];
      const ids = Object.keys(groups[k]);
      const children = this.buildChildren(
        k,
        ids,
        groups,
        orderedTurnState,
        menuHandler
      );
      const childKeys = this.buildChildKeys(k, ids, groups);

      if (groupKeys.length > 1) {
        keys = keys.concat(k);
        data = data.concat({
          children,
          data: [displayName(k)],
          keys: childKeys
        });
      } else {
        keys = keys.concat(childKeys);
        data = data.concat(children);
      }
    }

    return (
      <CustomTable
        {...{
          cols,
          colWidth,
          data,
          keys,
          selectedRow:
            selectedInstrument && this.buildSelectionKey(selectedInstrument),
          onRowSelect: data => {
            const { onClick } = this.props;
            const decodedData = this.parseSelectionKey(data);

            onClick(decodedData)();
          }
        }}
      />
    );
  }

  render() {
    const { menuData } = this.state;

    return (
      <Fragment>
        {this.buildMarketItems()}
        {menuData !== null && (
          <CustomMenu
            anchorEl={menuData.target}
            onClose={() => {
              this.setState({ menuData: null });
            }}
            open={true}
            menuItems={{
              ...(menuData.type === "RE" && {
                "Change residence": async () => {
                  await this.handleChangeResidence(menuData.id);
                }
              })
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstrumentList);
