import { Dispatch } from 'redux';
export const SIGNIN = 'SIGNIN';
export const SIGNUP = 'SIGNUP';
export const SIGNOUT = 'SIGNOUT';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const CHECK_EMAIL = 'CHECK_EMAIL';
export const SET_MESSAGE = 'SET_MESSAGE';

export const signIn = (user: any) => (dispatch: Dispatch) => {
  dispatch({type: SIGNIN, payload: user})
}


export const signUp = (user: any) => (dispatch: Dispatch) => {
    dispatch({type: SIGNUP})
}


export const signOut = () => (dispatch: Dispatch) => {
    dispatch({type: SIGNOUT})
}

export const checkEmail = (email: string) => (dispatch: Dispatch) => {
   dispatch({type: CHECK_EMAIL, payload: email})
}

export const resetPassword = (email: string, password: string) => (dispatch: Dispatch) => {
    dispatch({type: RESET_PASSWORD})
}

export const updateAccount = (name: string) => (dispatch: Dispatch) => {
    dispatch({type: UPDATE_ACCOUNT, payload: name})
}