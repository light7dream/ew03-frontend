import { combineReducers } from 'redux';

import bleReducer from './bleReducer';
import timerReducer from './timerReducer';
import authReducer from './authReducer';
import appReducer from './appReducer';

export default combineReducers({
    auth: authReducer,
    app: appReducer,
    BLE: bleReducer,
    timer: timerReducer,
});