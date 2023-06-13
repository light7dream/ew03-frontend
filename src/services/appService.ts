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

export function checkMAC(mac:any){
        return new Promise((resolve, reject) => {
            axios
                .post("/beacons/checkMAC", { mac })
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
                })  
        })
    }
export function checkEditMAC(id:any, mac:any){
    return new Promise((resolve, reject) => {
        axios
            .post("/beacons/checkEditMAC", { mac, id })
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
            })  
    })
}

export function saveAuditGroup(title: string, selectedList: any){
    console.log("selectedList => ",selectedList);
    return new Promise((resolve, reject) => {
        axios
            .post("/audit/saveAuditGroup", { title, selectedList })
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
            })  
    })
}

export function getAllAuditGroups(){
    return new Promise((resolve, reject) => {
        axios
            .post("/audit/getAllAuditGroups", { })
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
            })  
    })
}
export function deleteGroup(id: any){
    return new Promise((resolve, reject) => {
        axios
            .post("/audit/deleteGroup", { id })
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
            })  
    })
}


export function v(data: any) {
    return new Promise((resolve, reject) => {
        axios
            .post("/v", { data })
            .then((res: AxiosResponse) => {
                resolve(res.data)
            })
            .catch(err=>{
                reject(err)
            })
    })
}
