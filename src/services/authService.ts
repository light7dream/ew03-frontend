import axios from '../utils/axios';
import { AxiosResponse } from 'axios';


    export function signIn(email: string, password: string) {
        return new Promise((resolve, reject) => {
            axios
                .post('/signin', {email, password})
                .then((res: AxiosResponse) => {
                    resolve(res.data)
                },
                error=>{
                    reject({ message: 'Something went wrong' })
                })
                .catch(error => {
                    const msg =  { message: 'Please check your connection' };
                    reject(msg)
                })
        })
    }   


    export function signUp(email: string, name: string, password: string) {
        return new Promise((resolve, reject) => {
            axios
                .post('/signup', {email, name, password})
                .then((res: AxiosResponse) => {
                    resolve(res.data)
                },
                error => {
                    console.log(error.message)
                    const msg = { message: 'Something went wrong' };
                    reject(msg)
                })
                .catch(error => {
                    const msg = { message: 'Please check your connection' };
                    reject(msg)
                })
        })
    }   


    export function verifyEmail(email: string) {
        return new Promise((resolve, reject) => {
            axios
                .post('/verify-email', {email})
                .then((res: AxiosResponse) => {
                    resolve(res.data)
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg)
                })
                .catch(error => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg)
                })
        })
    }   


    export function resetPassword(email: string, password: any) {
        return new Promise((resolve, reject) => {
            axios
                .post('/reset-password', {email, password})
                .then((res: AxiosResponse) => {
                    resolve(res.data)
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg)
                })
                .catch(error => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg)
                })
        })
    }  

    export function updateAccount(email:string, name: string, password: string) {
        return new Promise((resolve, reject) => {
            axios
                .post('/update-account', {email, name, password})
                .then((res: AxiosResponse) => {
                    resolve(res.data)
                },
                error => {
                    const msg = error.message ? error.message : { message: 'Something went wrong' };
                    reject(msg)
                })
                .catch(error => {
                    const msg = error.message ? error.message : { message: 'Please check your connection' };
                    reject(msg)
                })
        })
    }



