import { Dispatch } from 'redux';

export const GET_BEACONS = 'GET_BEACONS';
export const ADD_BEACON = 'ADD_BEACON';
export const UPDATE_BEACON = 'UPDATE_BEACON';
export const DELETE_BEACON = 'DELETE_BEACON';
export const LOADING = 'LOADING';
export const SET_MESSAGE = 'SET_MESSAGE';
export const GET_ALL_AUDIT_GROUPS = 'GET_ALL_AUDIT_GROUPS';
export const ADD_GROUP = 'ADD_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';

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

export const setAllAuditGroups = (groups: any) => (dispatch: Dispatch) => {
    dispatch({type: GET_ALL_AUDIT_GROUPS, payload: groups});
}
export const addedGroup = (group: any) => (dispatch: Dispatch) => {
    dispatch({type: ADD_GROUP, payload: group});
}
export const updatedGroup = (group: any) => (dispatch: Dispatch) => {
    dispatch({type: UPDATE_GROUP, payload: group});
}
export const deletedGroup = (id: any) => (dispatch: Dispatch) => {
    dispatch({type: DELETE_GROUP, payload: id});
}
