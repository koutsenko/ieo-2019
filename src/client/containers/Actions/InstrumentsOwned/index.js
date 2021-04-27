/**
 * Имеющиеся на руках Бонды, кредиты и недвижка обладают своими параметрами.
 * Поэтому они перечислены отдельно от рыночных предложений.
 *
 * Бонды выводим ПАКЕТНО, столько-то бондов c name, куплено такого-то числа.
 * Квартиры и кредиты выводим ПОШТУЧНО в любом случае.
 */

import styles from "./index.module.css";

import * as R from "ramda";
import React, { Component } from "react";
import { connect } from "react-redux";

import OwnedCreditsContainer from "client/containers/Actions/InstrumentsOwned/Credits";
import OwnedBondsContainer from "client/containers/Actions/InstrumentsOwned/Bonds";
import OwnedReContainer from "client/containers/Actions/InstrumentsOwned/RE";

const mapStateToProps = (state, ownProps) => {
  const { orderedTurnState } = state.game;
  const { types } = ownProps;
  const { meta } = orderedTurnState.instruments;
  const groups = types.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: R.pickBy(i => i.type === cur, meta) // meta subset for each instrument type
    }),
    {}
  );
  const keys = Object.keys(groups);
  const type = ["Credit", "RE", "Bond"].find(t => keys.includes(t));

  return { orderedTurnState, type };
};

class InstrumentsOwned extends Component {
  render() {
    const { orderedTurnState, type } = this.props;
    const TagName =
      {
        Bond: OwnedBondsContainer,
        Credit: OwnedCreditsContainer,
        RE: OwnedReContainer
      }[type] || null;

    return !["Credit", "RE", "Bond"].includes(type) ? null : (
      <div className={styles["your-items"]}>
        <TagName {...{ orderedTurnState }} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(InstrumentsOwned);
