import styles from "./index.module.css";

import cn from "classnames";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import Divider from "client/components/Divider";
import { GAME_STATE_RUNNING } from "common/constants/states/game";
import ActionsChartsContainer from "client/containers/Actions/Charts";
import InstrumentGroupsTabbar from "client/containers/Actions/InstrumentGroupsTabbar";
import InstrumentList from "client/containers/Actions/InstrumentList";
import InstrumentsOwned from "client/containers/Actions/InstrumentsOwned";
// import LeverageSwitch from "client/containers/Actions/LeverageSwitch";
import BuySellWidget from "client/containers/Actions/Widgets/BuySell";
import RealEstateWidget from "client/containers/Actions/Widgets/RealEstate";
import TakeCreditWidget from "client/containers/Actions/Widgets/TakeCredit";
import getTypesByTabIndex from "common/selectors/instrumentGroups";

/**
 * Виджет действий.
 * Перерисовывается каждый ход - ключ по году, id инструмента и range кредита.
 */
const ActionWidget = ({ selectedInstrument, turn, type }) => {
  const { id, range } = selectedInstrument;
  const key = `${turn}_${id}${range === undefined ? "" : `_${range}`}`;
  const TagName =
    {
      Credit: TakeCreditWidget,
      RE: RealEstateWidget
    }[type] || BuySellWidget;

  return <TagName {...{ key, selectedInstrument }} />;
};

const mapStateToProps = state => ({
  gameState: state.game.gameState,
  turnState: state.game.turnState,
  leverage: state.uiclient.leverage
});

class ActionsContainer extends Component {
  state = {
    activeGroup: 0,
    selectedInstrument: null
  };

  constructor(props) {
    super(props);

    this.setActiveGroup = this.setActiveGroup.bind(this);
  }

  componentWillUpdate(nextProps) {
    const { gameState } = this.props;

    if (
      gameState === GAME_STATE_RUNNING &&
      nextProps.gameState !== GAME_STATE_RUNNING
    ) {
      this.setActiveInstrument(null);
    }
  }

  setActiveGroup = (event, activeGroup) => {
    this.setState({
      activeGroup
    });
  };

  setActiveInstrument = selectedInstrument => () => {
    this.setState(
      {
        selectedInstrument
      },
      () => {
        // Колбэк смены активного инструмента. Вкладок без выбранных инструментов не будет.
        // Поэтому ограничимся обновлением новостей по действию setActiveInstrument
        const { notifyNewsCb } = this.props;
        const { activeGroup, selectedInstrument } = this.state;

        notifyNewsCb({ activeGroup, selectedInstrument });
      }
    );
  };

  render() {
    const { turnState } = this.props;
    const { activeGroup, selectedInstrument } = this.state;
    const { turn } = turnState;
    const types = getTypesByTabIndex(activeGroup);

    return (
      <Fragment>
        <div className={styles.topline}>
          <InstrumentGroupsTabbar
            {...{
              activeGroup,
              setActiveGroup: this.setActiveGroup
            }}
          />
          {/* <LeverageSwitch /> */}
        </div>
        <div
          className={cn(styles["instrument-container"], {
            [styles.RE]: activeGroup === 6
          })}
        >
          <div className={styles["instrument-market-and-own-container"]}>
            <div className={styles.container1}>
              <InstrumentList
                {...{
                  types,
                  selectedInstrument,
                  onClick: this.setActiveInstrument
                }}
              />
            </div>
            <InstrumentsOwned {...{ types }} />
          </div>
          <Divider />
          {selectedInstrument !== null && (
            <div
              className={cn(styles["selected-instrument-manage"], {
                [styles.RE]: activeGroup === 6
              })}
            >
              <div className={styles["charts-container"]}>
                <ActionsChartsContainer {...{ selectedInstrument }} />
              </div>
              <div className={styles.widget}>
                <ActionWidget
                  {...{
                    selectedInstrument,
                    turn,
                    type: turnState.instruments.meta[selectedInstrument.id].type
                  }}
                />
              </div>
              <div className={styles["desc-container"]}>
                {turnState.instruments.names[selectedInstrument.id].desc}
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(ActionsContainer);
