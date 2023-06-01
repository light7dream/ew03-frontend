import { PermissionsAndroid, Platform } from 'react-native';

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
  disconnectedDevice: device
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
        console.log("powered on");
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

export const scan = () => {
  return async (dispatch: Function, getState: Function, DeviceManager: any) => {
    const permission = Platform.OS === 'ios'? true: await requestLocationPermission();
    if (permission) {
      DeviceManager.startDeviceScan(null, { allowDuplicates: false }, (error: any, device: any) => {
        dispatch(changeStatus('Scanning'));
        if (error) {
          console.log(error);
        }
        if (device !== null) {
          dispatch(addBLE(device));
        }
      });
    } else {
      //TODO: here we could treat any new state or new thing when there's no permission to BLE
      console.log('Error permission');
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

export const connectDevice = (device: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Connecting"));
    // DeviceManager.stopDeviceScan()
    device
      .connect()
      .then((device: any) => {
        dispatch(changeStatus("Discovering"));
        let allCharacteristics = device.discoverAllServicesAndCharacteristics()
        dispatch(connectedDevice(device));

        const serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; // UUID of the service that contains the location characteristic
        device.characteristicsForService(serviceUUID)
          .then((characteristics) => {
            const locationCharacteristic = characteristics.find((c) => c.uuid === '0000ffe1-0000-1000-8000-00805f9b34fb'); // UUID of the location characteristic
            locationCharacteristic.monitor((error, characteristic) => {
              if (error) {
              console.log('Error while monitoring characteristic:', error);
              return;
              }
              
              const { value } = characteristic;
              const latitude = value.getFloat32(0, true);
              const longitude = value.getFloat32(4, true);

              dispatch(setLocation({latitude, longitude}));
            });
            const batteryCharacteristic = characteristics.find((c) => c.uuid ==='6e400002-b5a3-f393-e0a9-e50e24dcca9e'); // UUID of the battery characteristic
            batteryCharacteristic.read()
            .then((data) => {
            const batteryLevel = data[0]; // Battery level as a byte value
            console.log('Battery level:', batteryLevel);
            })
            .catch((error) => {
            console.log('Error while reading battery characteristic:', error);
            });
          })
          .catch((error) => {
            console.log('Error while getting characteristics for service:', error);
          });
        return allCharacteristics;
      })
      .then((device: any) => {
        let services = device.services(device.id);
        return services;
      })
      .then((services: any) => {
          console.log("found services: ", services)
          dispatch(connectedDeviceServices(services));
        }, (error: any) => {
          console.log("SCAN", error);
      })
      .catch(error=>console.log(error))

  }
}

export const disconnectDevice = (device: any) => {
  return (dispatch: Function, getState: Function, DeviceManager: any) => {
    dispatch(changeStatus("Disconnecting"));
    // DeviceManager.stopDeviceScan()
    device
      .cancelConnection()
      .then((cancelled: any) => {
        dispatch(changeStatus("Disconnected"));
        dispatch(disconnectedDevice(device));
      })
      .catch((error)=>console.log(error))
  }
}
