import styles from "./index.module.css";

import cn from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";

import toggleEventsCollapsed from "client/actions/toggleEventsCollapsed";
import NewsHeading from "client/containers/News/Heading";
import getTypesByTabIndex from "common/selectors/instrumentGroups";

const defaultVisible = {
  global: true,
  personal: true,
  instrument: true
};

const mapStateToProps = state => ({
  eventsCollapsed: state.uiclient.eventsCollapsed
});

const mapDispatchToProps = {
  toggleEventsCollapsed
};

class NewsContainer extends Component {
  static getDerivedStateFromProps(props, state) {
    const { screen, orderedTurnState } = props;
    const { instruments, events, gameStartPeriod } = orderedTurnState;
    const { prevScreen } = state;
    let news = [];

    if (orderedTurnState === undefined) {
      return { news };
    }

    let changes = {};

    // если изменилась активная вкладка - тогглим переключатели
    if (prevScreen !== screen) {
      changes.prevScreen = screen;
      changes.visible = {
        ...state.visible,
        personal: screen === 0,
        instrument: screen === 1
      };
    }

    const visible =
      changes.visible !== undefined ? changes.visible : state.visible;

    // формируем новости
    if (visible.instrument) {
      // инструменты - определяемся с источником
      const { newsSource } = props;
      let visibleTypes = [];
      let selectedInstrument;
      if (
        newsSource !== null &&
        ![null, undefined].includes(newsSource.activeGroup)
      ) {
        visibleTypes = getTypesByTabIndex(newsSource.activeGroup);
        selectedInstrument = newsSource.selectedInstrument;
      }

      let ids = Object.keys(instruments.meta).filter(id =>
        visibleTypes.includes(instruments.meta[id].type)
      );

      if (![null, undefined].includes(selectedInstrument)) {
        // Переставим в начало ids выбранного инструмента
        const index = ids.indexOf(selectedInstrument.id);
        if (index !== -1) {
          ids.splice(index, 1);
          ids = [selectedInstrument.id, ...ids];
        } else {
          console.log("error");
        }
      }

      // Сформируем массив новостей
      ids.forEach(id => {
        const { name } = instruments.names[id];
        instruments.history[id].forEach(h => {
          const text = h.news;
          if (text !== "" && text !== undefined) {
            const turn = h.period - gameStartPeriod + 1;
            const message = `${name}: ${text}`;

            news.push({
              id: `${id}_${turn}_instrument`,
              message,
              turn,
              type: "instrument"
            });
          }
        });
      });
      // console.log(visibleTypes, selectedInstrument);
    }
    if (visible.personal) {
      Object.keys(events.playerEvents).forEach(turn => {
        news.push({
          id: `${turn}_personal`,
          message: events.playerEvents[turn].message,
          turn,
          type: "personal"
        });
      });
    }
    if (visible.global) {
      Object.keys(events.globalEvents).forEach(turn => {
        news.push({
          id: `${turn}_global`,
          message: events.globalEvents[turn].message,
          turn,
          type: "global"
        });
      });
    }

    // только за последние 3 года
    news = news.filter(n => n.turn > orderedTurnState.turn - 3);

    // сортировка по ходам (годам)
    news.sort((n1, n2) => n2.turn - n1.turn);

    // записываем измененный набор news
    changes.news = news;

    return changes;
  }

  constructor(props) {
    super(props);

    this.state = {
      news: [],
      prevScreen: props.screen,
      visible: defaultVisible
    };

    this.setVisible = this.setVisible.bind(this);
  }

  setVisible = visible => {
    this.setState({
      visible
    });
  };

  toggleEventsCollapsed = () => {
    const { eventsCollapsed, toggleEventsCollapsed } = this.props;

    toggleEventsCollapsed(!eventsCollapsed);
  };

  render() {
    const { eventsCollapsed, orderedTurnState } = this.props;
    const { news, visible } = this.state;
    const { setVisible } = this;

    return orderedTurnState === undefined ? null : (
      <div
        className={cn(styles["container"], {
          [styles["container-full"]]: !eventsCollapsed,
          [styles["container-collapsed"]]: eventsCollapsed
        })}
      >
        <NewsHeading
          {...{
            orderedTurnState,
            eventsCollapsed,
            toggleEventsCollapsed: this.toggleEventsCollapsed,
            visible,
            setVisible
          }}
        />
        {!eventsCollapsed && (
          <div
            className={cn(
              styles["news-content-wrapper"],
              styles["shadow-container"]
            )}
          >
            <div className={styles["top-shadow"]}>&nbsp;</div>
            <div className={styles["news-content"]}>
              {news.map(record => {
                const className = styles[record.type];
                const key = record.id;
                const { message, turn } = record;

                return (
                  <Typography {...{ className, key }}>
                    <span className={styles.year}>Year {turn}:</span> {message}
                  </Typography>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsContainer);
