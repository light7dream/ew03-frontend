import { PermissionsAndroid, Platform } from 'react-native';
import { ScanMode } from 'react-native-ble-plx';
import { ToastAndroid } from 'react-native';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
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
          dispatch(connectDevice(device));
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

export const connectDevice = (device: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Connecting"));
    DeviceManager.stopDeviceScan()
    DeviceManager.connectToDevice(device.id, {autoConnect: true})
      .then((device: any) => {
        dispatch(changeStatus("Discovering"));
        let allCharacteristics = device.discoverAllServicesAndCharacteristics()
        dispatch(connectedDevice(device));
        const serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; // UUID of the service that contains the location characteristic
        device.characteristicsForService(serviceUUID)
          .then((characteristics: any) => {
            const locationCharacteristic = characteristics.find((c) => c.uuid === '0000ffe1-0000-1000-8000-00805f9b34fb'); // UUID of the location characteristic
            locationCharacteristic.monitor((error, characteristic) => {
              if (error) {
              console.log('Error while monitoring characteristic:', error);
              return;
              }
              
              const { value } = characteristic;
              const lat = value.getFloat32(0, true);
              const lng = value.getFloat32(4, true);

              dispatch(setLocation({id: device.id, location: {lat, lng}}));
            });
            const batteryCharacteristic = characteristics.find((c) => c.uuid ==='6e400002-b5a3-f393-e0a9-e50e24dcca9e'); // UUID of the battery characteristic
            batteryCharacteristic.read()
              .then((data: any) => {
                const batteryLevel = data[0]; // Battery level as a byte value
                console.log('Battery level:', batteryLevel);
                dispatch(setBattery({id: device.id, battery: batteryLevel}))
              })
            .catch((error: any) => {
              console.log('Error while reading battery characteristic:', error);
            });
          })
          .catch((error: any) => {
            console.log('Error while getting characteristics for service:', error);
          });
          
        dispatch(disconnectDevice(device));
      })
      .catch((error: any)=>{
        console.log(error)
        dispatch(disconnectDevice(device));
      })

  }
}

export const disconnectDevice = (device: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Disconnecting"));
    DeviceManager.cancelDeviceConnection(device.id)
      .then((device) => {
        dispatch(changeStatus("Disconnected"));
        // dispatch(disconnectedDevice(device));
      })
      .catch((error: any)=>console.log('Disconnect', error))
  }
}
