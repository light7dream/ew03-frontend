import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import {BleManager} from 'react-native-ble-plx';
import thunk from 'redux-thunk';

const DeviceManager = new BleManager();

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument(DeviceManager)),
);

export type AppDisPatch = typeof store.dispatch;