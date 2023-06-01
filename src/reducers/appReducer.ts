import { ADD_BEACON, UPDATE_BEACON, DELETE_BEACON, GET_BEACONS, LOADING, SET_MESSAGE } from '../actions/appActions';

const initialState = {
    loading: false,
    beacons: [],
    message: ''
};

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_BEACON:
      return {
        ...state,
        beacons: [...state.beacons, action.payload]
      };
    case UPDATE_BEACON:
      return {
        ...state,
        beacons: state.beacons.map((beacon: any) => {
            if(beacon.id == action.payload.id)
            {
                return action.payload
            }
            return beacon
        })
      };
    case DELETE_BEACON:
      return {
        ...state,
        beacons: state.beacons.filter((beacon: any) => beacon.id !== action.payload)
      };
    case GET_BEACONS:
      return {
            ...state,
            beacons: action.payload
      };
    case LOADING:
        return {
            ...state,
            loading: action.payload
        }
    case SET_MESSAGE:
        return {
            ...state,
            message: action.payload
        }
    default:
      return state;
  }
};

export default appReducer;
