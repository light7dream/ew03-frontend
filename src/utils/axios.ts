/* eslint-disable prettier/prettier */
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://23.227.203.217:5000/api',
  baseURL: 'http://10.10.11.17:5000/api',
  timeout: 5000,
});

export default instance;
