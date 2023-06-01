import { START_TIMER, STOP_TIMER, RESET_TIMER, TICK } from '../actions/timerActions';

const initialState = {
  isRunning: false,
  timeElapsed: 0
};

const timerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case START_TIMER:
      return {
        ...state,
        isRunning: true
      };
    case STOP_TIMER:
      return {
        ...state,
        isRunning: false
      };
    case RESET_TIMER:
      return {
        ...initialState
      };
    case TICK:
      return {
        ...state,
        timeElapsed: state.timeElapsed + 1
      };
    default:
      return state;
  }
};

export default timerReducer;
