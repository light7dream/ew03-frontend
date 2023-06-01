import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/axios';

let STORAGE_KEY = '@BLEBEACON';

export const readStorage = async () => {
    return await AsyncStorage.getItem(STORAGE_KEY);
};

export const storeStorage = async (data: any) => {
    try {
        console.log(data)
        axios.defaults.headers.common.Authorization = `Bearer ${data}`;
        await AsyncStorage.setItem(STORAGE_KEY, data)
        console.log('Data successfully saved')
    } catch (e) {
        console.log('Failed to save the data to the storage')
    }
}

export const clearStorage = async () => {
    try {
        delete axios.defaults.headers.common.Authorization;
        await AsyncStorage.clear();
        console.log('Storage successfully cleared!');
    } catch (e) {
        console.log('Failed to clear the async storage.');
    }
};