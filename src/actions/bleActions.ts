import { PermissionsAndroid, Platform } from 'react-native';
import { ScanMode } from 'react-native-ble-plx';
import { ToastAndroid } from 'react-native';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { v } from '../services/appService';
export const addBLE = (device: any) => ({
  type: 'ADD_BLE',
  device,
});

export const connectedDevice = (device: any) => ({
  type: "CONNECTED_DEVICE",
  connectedDevice: device
});

export const disconnectedDevice = (device: any) => ({
  type: "DISCONNECTED_DEVICE",
  payload: device
});

export const connectedServiceCharacteristics = (characteristic: any) => ({
  type: "CONNECTED_CHARACTERISTICS",
  connectedServiceCharacteristics: characteristic
});

export const connectedDeviceServices = (services: any) => ({
  type: "CONNECTED_SERVICES",
  connectedDeviceServices: services
});

export const selectedService = (serviceID: any) => ({
  type: "SELECTED_SERVICE",
  selectedService: serviceID
});

export const selectedCharacteristic = (characteristic: any) => ({
  type: "SELECTED_CHARACTERISTIC",
  selectedCharacteristic: characteristic
});

export const changeStatus = (status: string) => ({
  type: "CHANGE_STATUS",
  status: status
});

export const setLocation = (location: any) => ({
  type: "SET_LOCATION",
  location: location
});
export const setBattery = (battery: any) => ({
  type: "SET_BATTERY",
  battery: battery
});

//some thunks to control the BLE Device

export const startScan = () => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    // you can use Device Manager here
    console.log("start Scanning");
    const subscription = DeviceManager.onStateChange((state: string) => {
      if (state === 'PoweredOn') {
        console.log("Powered on");
        dispatch(scan());
        subscription.remove();
      }
    }, true);
  };
};

//on android device, we should ask permission
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location permission for bluetooth scanning',
        message: 'wahtever',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestPermissions = async () => {
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
          return granted === PermissionsAndroid.RESULTS.GRANTED;
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

          return isGranted;
      }
  } else {
      return true;
  }
};


export const scan = () => {
  return async (dispatch: Function, getState: Function, DeviceManager: any) => {
    const permission = Platform.OS === 'ios'? true: await requestPermissions();
    if (permission) {
      DeviceManager.startDeviceScan(null, 
        { 
        allowDuplicates: false,
        scanMode: ScanMode.LowLatency 
      }, (error: any, device: any) => {
        dispatch(changeStatus('Scanning'));
        if (error) {
          console.log(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        }
        if (device !== null) {
          dispatch(addBLE(device));
          // dispatch(connectDevice(device));
        }
      });
    } else {
      //TODO: here we could treat any new state or new thing when there's no permission to BLE
      ToastAndroid.show('Bluetooth isn\'t allowed', ToastAndroid.SHORT);
    }
  };
};

export const getServiceCharacteristics = (service: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    let state = getState();
    DeviceManager.characteristicsForDevice(
      state.BLEs.connectedDevice.id,
      service.uuid,
    ).then((characteristics: any) => {
      dispatch(connectedServiceCharacteristics(characteristics));
    });
  };
};

export const stopScan = () => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Stop scanning"));
    DeviceManager.stopDeviceScan()
  }
}

const log = (device:any, data: any) => {
  v({device, data})
      .then(()=>{

      })
      .catch(err=>console.log(err))
}

export const connectDevice = (device: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Connecting"));
    DeviceManager.stopDeviceScan()
    DeviceManager.connectToDevice(device.id, {autoConnect: true})
      .then((device: any) => {
        // getServiceCharacteristics(device);
        (async()=>{
          let allCharacteristics = await device.discoverAllServicesAndCharacteristics()
          log(device.id, allCharacteristics)
          const services = await device.services();
          for(var i =0; i< services.length; i++) {
            const serviceUUID = services[i].uuid;
            const characteristics = await device.characteristicsForService(serviceUUID);
            log(device.id, characteristics);
            for(var j =0;j< characteristics.length;j++) {
              const characteristicUUID = characteristics[j].uuid;
              await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err: any, char: any) => {
                log(device.id, {s: services[i], c: characteristics[j], v: char.value})
              })
            }
          }
        })()
        dispatch(changeStatus("Discovering"));
        log(device.id, device);
        dispatch(connectedDevice(device));
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device: any) => {
        DeviceManager.serviceForDevice(device.id)
          .then((services: any)=>{
            console.log(services)
            log(device.id, services)
          })
          .catch((err:any)=>{
            console.log(err)
          })
      })
      .catch((error: any)=>{
        console.log(error)
        log('#',error)
        dispatch(disconnectDevice(device));
      })

  }
}

export const disconnectDevice = (device: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Disconnecting"));
    DeviceManager.cancelDeviceConnection(device.id)
      .then((device: any) => {
        dispatch(changeStatus("Disconnected"));
        // dispatch(disconnectedDevice(device));
      })
      .catch((error: any)=>console.log('Disconnect', error))
  }
}


