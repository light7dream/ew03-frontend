import { ADD_BEACON, UPDATE_BEACON, DELETE_BEACON, GET_BEACONS, LOADING, SET_MESSAGE ,
  GET_ALL_AUDIT_GROUPS, DELETE_GROUP, ADD_GROUP, UPDATE_GROUP} from '../actions/appActions';

const initialState = {
    loading: false,
    beacons: [],
    audits: [],
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
          console.log(beacon)
            if(beacon._id == action.payload._id)
            {
                return action.payload;
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
    case GET_ALL_AUDIT_GROUPS:
      return {
        ...state,
        audits: action.payload
      }
    case ADD_GROUP:
      return {
        ...state, audits: [ ...state.audits , action.payload]
      }
    case UPDATE_GROUP:
      return {
        ...state, 
        audits: state.audits.map((audit: any) => {
            if(audit._id == action.payload._id){
                return action.payload;
            }
            return audit;
        })
      }
    case DELETE_GROUP:
      return {...state, audits: state.audits.filter((group:any) => group.id != action.payload)};
    default:
      return state;
  }
};

export default appReducer;
