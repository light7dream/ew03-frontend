import update from 'immutability-helper';

interface BLEList {
  id: string;
  name: string;
}

interface ConnectedDevice {
  [key: string]: any;
}

interface SelectedService {
  [key: string]: any;
}

interface SelectedCharacteristic {
  [key: string]: any;
}

interface BLEReducerState {
  BLEList: BLEList[];
  connectedDevice: ConnectedDevice;
  connectedDeviceServices: string[];
  connectedServiceCharacteristics: string[];
  selectedService: SelectedService;
  selectedCharacteristic: SelectedCharacteristic;
  location: any,
  battery: any,
  status: string;
}

const INITIAL_STATE: BLEReducerState = {
  BLEList: [],
  connectedDevice: {},
  connectedDeviceServices: [],
  connectedServiceCharacteristics: [],
  selectedService: {},
  selectedCharacteristic: {},
  location: {
      latitude: 37.78825,
      longitude: -122.4324
  },
  battery: 100,
  status: 'disconnected',
};

const BLEReducer = (state = INITIAL_STATE, action: any): BLEReducerState => {
  switch (action.type) {
    case 'ADD_BLE':
      // console.log(action.device.name);
      if (
        state.BLEList.some(device => device.id === action.device.id) ||
        action.device.name === null
      ) {
        return state;
      } else {
        return update(state, {
          BLEList: {$set: [...state.BLEList, action.device]},
        });
      }
    case 'CONNECTED_DEVICE':
        return update(state, {connectedDevice: {$set: action.connectedDevice}});
    case 'DISCONNECTED_DEVICE':
        return update(state, {connectedDevice: {$apply: (items: any) => items.filter((item: any) => item.id !== action.disconnectedDevice.id)}});
    case 'CONNECTED_SERVICES':
      return update(state, {
        connectedDeviceServices: {$set: action.connectedDeviceServices},
      });
    case 'SELECTED_SERVICE':
      return update(state, {selectedService: {$set: action.selectedService}});
    case 'SELECTED_CHARACTERISTIC':
      return update(state, {
        selectedCharacteristic: {$set: action.selectedCharacteristic},
      });
    case 'CONNECTED_CHARACTERISTICS':
      return update(state, {
        connectedServiceCharacteristics: {
          $set: action.connectedServiceCharacteristics,
        },
      });
      case 'SET_LOCATION':
        return update(state, {location: {$set: action.location}});
        case 'SET_BATTERY':
          return update(state, {battery: {$set: action.battery}});
      case 'CHANGE_STATUS':
        return update(state, {status: {$set: action.status}});
    default:
      return state;
  }
};

export default BLEReducer;