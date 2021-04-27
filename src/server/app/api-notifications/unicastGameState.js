/**
 * Отправка измененного состояния (патчинг, например после живого релоада сценария)
 */

import { GAME_CHANGED } from "common/constants/notifications";
import applyOrders from "common/calc/applyOrders";

export default (state, socketId, turnState) => {
  const { socketpool } = state;
  const orderedTurnState = applyOrders(turnState);
  const socket = socketpool[socketId];

  try {
    socket.send(
      JSON.stringify({
        type: GAME_CHANGED,
        turnState,
        orderedTurnState
      })
    );
  } catch (error) {
    console.error("Error send to socket: ", error);
  }
};
