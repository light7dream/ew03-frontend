import axios from '../utils/axios';
import { AxiosResponse } from 'axios';


export function addBeacon(data: any) {
        return new Promise((resolve, reject) => {
            axios
                .post("/beacons/add", data)
                .then((res: AxiosResponse) => {
                    resolve(res.data);
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg);
                })
                .catch((error) => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg);
                });
        });
    }


export function getBeacons() {
        return new Promise((resolve, reject) => {
            axios
                .post("/beacons")
                .then((res: AxiosResponse) => {
                    resolve(res.data);
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg);
                })
                .catch((error) => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg);
                });
        });
    }


export function updateBeacon(id: any, data: any) {
        return new Promise((resolve, reject) => {
            axios
                .post("/beacons/update", {id, data})
                .then((res: AxiosResponse) => {
                    resolve(res.data);
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg);
                })
                .catch((error) => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg);
                });
        });
    }


export function deleteBeacon(id: any) {
        return new Promise((resolve, reject) => {
            axios
                .post("/beacons/delete", {id})
                .then((res: AxiosResponse) => {
                    resolve(res.data);
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg);
                })
                .catch((error) => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg);
                });
        });
    }
