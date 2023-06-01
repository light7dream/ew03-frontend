import React, { useRef, useState, useEffect } from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import MapView , { Marker, Region } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import Modal from "react-native-modal";
import {useSelector, useDispatch} from 'react-redux'
import { connectDevice, disconnectDevice, getServiceCharacteristics } from '../../actions/bleActions';
import { AppDisPatch } from '../../store';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

function DetailsScreen({navigation, route}) {

    const dispatch: AppDisPatch = useDispatch()
    const connectedDeviceServices = useSelector((state: any) => state.BLE.connectedDeviceServices)
    const battery = useSelector((state: any) => state.BLE.battery);
    const location = useSelector((state: any) => state.BLE.location);
    console.log('Services', connectedDeviceServices)
    console.log(route.params.device)
    const beacon = route.params.device;

    const mapRef = useRef<MapView>(null);

    const [coordinate, setCoordinate] = useState(location?location:{
        latitude: 37.78825,
        longitude: -122.4324
    })

    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(connectDevice(beacon.device))
        return () => {
            console.log('unmounted')
            dispatch(disconnectDevice(beacon.device))
        }
    }, [])
    
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const regionChangeCompleteHandler = async ({latitude, longitude}: Region) => {
        console.log(
          await mapRef.current?.addressForCoordinate({
            latitude,
            longitude,
          }),
        );
    };

    return (
        <View style={styles.container}>
            <MapView 
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
            >
                <Marker coordinate={coordinate} onPress={toggleModal} />
            </MapView>
            <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <View style={{borderRadius: 4, backgroundColor: '#ffffff', width: deviceWidth-60, paddingVertical: 20, paddingHorizontal: 8}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text>Device name</Text>
                            <Text>{beacon.myname}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text>Lat and Long</Text>
                            <Text>{location.latitude}, {location.longitude}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text>Battery</Text>
                            <Text>{battery}%</Text>
                        </View>
                        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text>Temperature</Text>
                            <Text>20.2 'C</Text>
                        </View> */}
                        <Button title="Close" onPress={toggleModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
export default DetailsScreen;

//create our styling code:
const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1, //the container will fill the whole screen.
      justifyContent: "flex-end",
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });