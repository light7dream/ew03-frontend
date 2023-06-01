import {SIGNIN, SIGNUP, RESET_PASSWORD, CHECK_EMAIL, SIGNOUT, UPDATE_ACCOUNT} from '../actions/authActions'
import { clearStorage, storeStorage } from '../constants/async';

const initialState = {
    user: null,
    checked: false,
    message: ''
};

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SIGNIN:
            storeStorage(action.payload.accessToken)
            return {
                ...state,
                user: action.payload.user
            }
        case SIGNUP:
            return state
        case SIGNOUT:
            clearStorage();
            return {
                ...state,
                user: null
            }
        case RESET_PASSWORD:
            return state
        case CHECK_EMAIL:
            return {
                ...state,
                checked: action.payload
            }
        case UPDATE_ACCOUNT:
            return{
                ...state,
                name: action.payload
            }
        default:
            return state
    }
}

export default authReducer