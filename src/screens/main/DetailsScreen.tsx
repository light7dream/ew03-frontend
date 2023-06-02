import React, { useRef, useState } from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import MapView , { Marker, Region } from 'react-native-maps';
import { Dimensions } from 'react-native';
import Modal from "react-native-modal";
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyBM7oejbfOKFrGXvyH2fhYY5mBaNI71_J8");
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

function DetailsScreen({navigation, route}) {
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
   
    console.log(route.params.device)
    const beacon = route.params.device;
    const location = beacon?.location;
    const battery = beacon?.battery;
    const description = beacon?.description;
    const mapRef = useRef<MapView>(null);
    
    const [address, setAddress] = useState(beacon?.address);
    const [coordinate, setCoordinate] = useState(location?{
        latitude: location.lat,
        longitude: location.lng
    }:{
        latitude: 37.78825,
        longitude: -122.4324
    })


    const [isModalVisible, setModalVisible] = useState(false);

    
    Geocoder.from(location.lat, location.lng)
    .then(json => {
        var addressComponent = json.results[0].formatted_address;
        console.log(json.results[0].formatted_address)
        setAddress(addressComponent)
    })
    .catch(error => console.warn(error));

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
                    latitude: location? location.lat: 37.78825,
                    longitude: location? location.lng: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
            >
                <Marker coordinate={coordinate} onPress={toggleModal} />
            </MapView>
            <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <View style={{borderRadius: 4, backgroundColor: defaultBackgroundColor, width: deviceWidth-60, paddingVertical: 20, paddingHorizontal: 8}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text style={{color: defaultColor}}>Device name</Text>
                            <Text style={{color: defaultColor}}>{beacon?.name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text style={{color: defaultColor}}>Lat and Long</Text>
                            <Text style={{color: defaultColor}}>{location?.lat}, {location?.lng}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text style={{color: defaultColor, fontSize: 10}}>{address}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text style={{color: defaultColor}}>Battery</Text>
                            <Text style={{color: defaultColor}}>{battery}%</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4}}>
                            <Text style={{color: defaultColor}}>Description</Text>
                            <Text style={{color: defaultColor}}>{description}</Text>
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