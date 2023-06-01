import { View, Text, PermissionsAndroid, Platform } from 'react-native'
import React, { useState } from 'react'
import { BleManager, ScanMode } from 'react-native-ble-plx'
import { PERMISSIONS, requestMultiple } from 'react-native-permissions'
import DeviceInfo from 'react-native-device-info'


type VoidCallback = (result: boolean) => void;

interface BluetoothLowEngergyApi {
    requestPermissions(cb: VoidCallback): Promise<void>;
    scanForPeripherals(): void;
    distance: number;
    devices: [];
    bleManager: any;
}

const DEVICE_LIST_LIMIT = 100;

function useBle(): BluetoothLowEngergyApi {
    
    const bleManager = new BleManager(
        {
            restoreStateIdentifier: 'my_ble_fi',
            restoreStateFunction: (restoredState) => {
                // Perform any necessary actions with restored state here
            }
        }
    );
    const [distance, setDistance] = useState<number>(-1);

    const [devices, setDevices] = useState<any>([]);

    const requestPermissions = async (cb: VoidCallback) => {
        if (Platform.OS === 'android') {
            const apiLevel = await DeviceInfo.getApiLevel();

            if(apiLevel < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Bluetooth Low Energy requires Location',
                        buttonNeutral: 'Ask Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'Ok',
                    }
                );
                cb(granted === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                const result = await requestMultiple([
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ]);

                const isGranted = 
                    result['android.permission.BLUETOOTH_CONNECT'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_SCAN'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.ACCESS_FINE_LOCATION'] ===
                        PermissionsAndroid.RESULTS.GRANTED;

                cb(isGranted);
            }
        } else {
            cb(true)
        }
    };

    const scanForPeripherals = () => {
        bleManager.startDeviceScan(
            null,
            {
                allowDuplicates: false,
                scanMode: ScanMode.LowLatency
            },
            (error, device) => {

                console.log(device?.name, device?.id)
                if(!device?.isConnected)
                bleManager.connectToDevice(device?.id, {autoConnect:true})
                // setDevices([device].concat(devices.slice(0, DEVICE_LIST_LIMIT)))
                if(devices.length>10)
                bleManager.stopDeviceScan();
                // if(device?.name?.includes('ARO')) {
                //     const currentDistance = Math.pow(10, (-75 - device.rssi!) / (10 * 3))
                //     distanceBuffer[numOfSamples % 3] = currentDistance;

                //     if(distanceBuffer.includes(-1)) {
                //         setDistance(-1);
                //     } else {
                //         const sum = distanceBuffer.reduce((a, b) => a + b);
                //         setDistance(Math.round(sum / distanceBuffer.length));
                //     }
                // }
                // numOfSamples++;
            }
        )
    };


    return {
        scanForPeripherals,
        requestPermissions,
        distance,
        devices,
        bleManager
    }
}

export default useBle;