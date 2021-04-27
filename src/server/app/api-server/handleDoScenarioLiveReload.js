import playerMadeTurn from "server/app/actions/playerMadeTurn";
import broadcastGameSuspended from "server/app/api-notifications/broadcastGameSuspended";
import broadcastGameResumed from "server/app/api-notifications/broadcastGameResumed";
import queryScenario from "server/app/api-sheets/queries/scenario";
import scenarioLoaded from "server/app/actions/scenarioLoaded";
import playerReset from "server/app/actions/playerReset";
import buildTurnState from "server/app/utils/buildTurnState";
import buildNextTurnState from "server/app/utils/buildNextTurnState";
import filterFuture from "server/app/utils/filterFuture";
import filterPast from "server/app/utils/filterPast";
import unicastGameState from "server/app/api-notifications/unicastGameState";
import { AUTH_PLAYER } from "server/app/constants/states";

export default store => async socketId => {
  const response = {
    success: true
  };

  // force to do it after sending response
  setTimeout(async () => {
    try {
      const state = store.getState();

      // suspend game
      broadcastGameSuspended(state);

      // reload scenario
      // TODO try/catch, falsy response
      const scenarioData = await queryScenario(state);
      store.dispatch(scenarioLoaded(scenarioData));

      // apply it!

      /**
       * По каждому игроку
       */
      const playing_logins = Object.keys(state.game.players);
      playing_logins.forEach(login => {
        const tss = state.game.players[login].turnStates;
        // запомнить номер последнего хода (число n)
        const ts = tss[tss.length - 1];
        const { turn } = ts;

        // найти идентификатор сокета игрока
        const playerSocketId = Object.keys(state.auth).find(
          id =>
            state.auth[id].login === login &&
            state.auth[id].status === AUTH_PLAYER
        );

        // сгенерить новый первый ход
        const firstState = buildTurnState(store)(playerSocketId);

        // стереть всю историю ходов и перезаписать её единственным новым
        store.dispatch(playerReset(login, firstState));

        // обычному бесправному игроку вернуть первый ход
        let nextState = firstState;

        // а демиургам n раз сделать конец хода, начиная со второго
        if (ts.demiurg) {
          for (var i = 2; i <= turn; i++) {
            nextState = buildNextTurnState(nextState, store);
            store.dispatch(playerMadeTurn(login, nextState));

            if (nextState.endByWin || nextState.endByPension) {
              break;
            }
          }
        }

        // всем игрокам разослать обновлённое состояние
        unicastGameState(
          state,
          playerSocketId,
          filterPast(filterFuture(nextState))
        );
      });

      // resume game
      broadcastGameResumed(state);
    } catch (error) {
      console.error("Error live scenario reload: ", error);
    }
  }, 0);

  return response;
};
