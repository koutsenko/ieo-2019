import { SERVER_NOTIFY } from "common/constants/actions";
import { GAME_STARTED } from "common/constants/notifications";
import req from "common/actions/socket/req";
import doGameJoin from "client/api/doGameJoin";
import loadTurn from "client/actions/loadTurn";

const autoReactions = ({ dispatch, getState }) => next => async action => {
  const { type, message } = action;
  const returnValue = next(action);

  // TODO 1 prompt user to join?
  if (type === SERVER_NOTIFY && message.type === GAME_STARTED) {
    try {
      const turnState = await dispatch(req(doGameJoin()));
      dispatch(loadTurn(turnState));
    } catch (error) {
      // TODO 2 handle errors
    }
  }

  return returnValue;
};

export default autoReactions;
