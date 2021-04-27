import styles from "./index.module.css";

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import doOrder from "client/actions/order";
import showSnackbar from "common/actions/ui/showSnackbar";
import req from "common/actions/socket/req";
import loadTurn from "client/actions/loadTurn";
import turn from "client/actions/turn";
import revertOrders from "client/actions/revertOrders";

// const speed = 1000;
const speed = 100;

const mapDispatchToProps = {
  req,
  showSnackbar,
  loadTurn
};

class ReplayBar extends Component {
  state = {
    loaded: false,
    strings: [],
    pointer: 0,
    auto: false,
    end: false,
    busy: false
  };

  interval = null;

  constructor(props) {
    super(props);

    this.handleDataLoad = this.handleDataLoad.bind(this);
    this.doNext = this.doNext.bind(this);
    this.startAuto = this.startAuto.bind(this);
    this.stopAuto = this.stopAuto.bind(this);
  }

  startAuto = () => {
    this.setState({ auto: true });

    this.interval = setInterval(async () => {
      const { end, busy } = this.state;

      if (end) {
        this.stopAuto();
        return;
      }

      if (busy) {
        return;
      }

      await this.doNext();
    }, speed);
  };

  stopAuto = () => {
    clearInterval(this.interval);
    this.setState({ auto: false });
  };

  doNext = async () => {
    const { req, showSnackbar, loadTurn } = this.props;
    const { pointer, strings } = this.state;
    const nextValue = pointer + 1;
    const end = strings.length === nextValue;

    let action;
    const row = strings[pointer];
    // FIXME В записи не выведены ответы "Проверить на банкротство"
    if (row.indexOf("made turn") === 0) {
      action = turn(false);
    } else {
      const orderRe = /in turn (\d+) made an order:/;
      const revertRe = /in turn (\d+) revert back all orders/;
      if (revertRe.test(row)) {
        action = revertOrders();
      } else {
        try {
          const rest = row.replace(orderRe, "").trim();
          const order = JSON.parse(rest);
          action = doOrder(order);
        } catch (error) {
          showSnackbar(false, `Bad order data: ${error}`);
          return;
        }
      }
    }

    // Начинается очень долгий запрос, именно здесь выставляю флаг busy
    await this.setState({ busy: true });
    try {
      loadTurn(await req(action));
      showSnackbar(true, "Action successful");
    } catch (error) {
      showSnackbar(false, `Action error: ${error}`);
      // Неудачный но конец очень долгого запроса, именно здесь сбрасываю флаг busy
      await this.setState({ busy: false });
      return;
    }

    if (end) {
      this.setState({
        end: true
      });
    } else {
      this.setState({
        pointer: nextValue
      });
    }

    // Неудачный но конец очень долгого запроса, именно здесь сбрасываю флаг busy
    await this.setState({ busy: false });
  };

  handleDataLoad = async e => {
    const { showSnackbar } = this.props;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const raw = text.split("\n");
      const nonEmptyRaw = raw.filter(r => r !== "");
      const nonActionRows = nonEmptyRaw.map(r => {
        const temp1 = r.slice(20); // Вырезаем штамп времени
        const regex = /\b(Player)\b \[.*?\]/; // Регулярка вырезает Player [XXX]
        const temp2 = temp1.replace(regex, "").trim(); // Вырезаем пробелы

        return temp2;
      });
      const strings = nonActionRows.filter(row => {
        const hasFinishTurn = row.indexOf("made turn") === 0;
        const hasOrder = row.indexOf("in turn") === 0;
        const hasAction = hasFinishTurn || hasOrder;

        return hasAction;
      });
      this.setState({
        strings,
        loaded: true
      });
      console.log(text);
    };

    try {
      reader.readAsText(e.target.files[0]);
    } catch (error) {
      showSnackbar(false, `Read file error: ${error}`);
    }
  };

  render() {
    const { loaded, strings, pointer, end, auto } = this.state;

    return (
      <div className={styles.replayBar}>
        {!loaded && <input type="file" onChange={this.handleDataLoad} />}
        {loaded && !end && auto && (
          <button onClick={this.stopAuto}>stop auto</button>
        )}
        {loaded && !end && !auto && (
          <button onClick={this.startAuto}>start auto</button>
        )}
        {loaded && !end && (
          <button disabled={auto} onClick={this.doNext}>
            run line
          </button>
        )}
        {loaded && !end && (
          <Fragment>
            <p className={styles.loadResult}>
              line {pointer + 1}/{strings.length}
            </p>
            <p className={styles.dataRow}>{strings[pointer]}</p>
          </Fragment>
        )}
        {end && <span>history end</span>}
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ReplayBar);
