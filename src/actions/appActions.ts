import { Dispatch } from 'redux';

export const GET_BEACONS = 'GET_BEACONS';
export const ADD_BEACON = 'ADD_BEACON';
export const UPDATE_BEACON = 'UPDATE_BEACON';
export const DELETE_BEACON = 'DELETE_BEACON';
export const LOADING = 'LOADING';
export const SET_MESSAGE = 'SET_MESSAGE';

const setLoading = (loading: boolean) => ({
    type: LOADING,
    payload: loading
})

export const addBeacon = (beacon: any) => (dispatch: Dispatch) => {
    dispatch({type: ADD_BEACON, payload: beacon})
}

export const setBeacons = (beacons: any) => (dispatch: Dispatch) => {
    dispatch({type: GET_BEACONS, payload: beacons})
}

export const updateBeacon = (beacon: any) => (dispatch: Dispatch) => {
    dispatch({type: UPDATE_BEACON, payload: beacon})
}

export const deleteBeacon = (id: any) => (dispatch: Dispatch) => {
    dispatch({type: DELETE_BEACON, payload: id})
 
}