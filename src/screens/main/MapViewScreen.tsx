import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import {StyleSheet, View} from 'react-native';
import MapView , { Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';


function MapViewScreen({navigation, route}) {
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
    const {location, back} = route.params;
    console.log(location)
    const mapRef = useRef<MapView>(null);
    const [selectedLocation, setSelectedLocation] = useState(location? location:{
        latitude: 37.78825,
        longitude: -122.4324
    });
    const [coordinate, setCoordinate] = useState(location? location:{
        latitude: 37.78825,
        longitude: -122.4324
    })

    const [isModalVisible, setModalVisible] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity 
                  onPress={()=>{
                    
                    navigation.navigate(back, {location: {
                        lat: selectedLocation?.latitude,
                        lng: selectedLocation?.longitude
                    }})
                  }}
                  style={{alignItems: 'center', marginRight: 8, flexDirection: 'row' }}
                  >
                    <MaterialIcons name='done' size={32} color={defaultColor} />
                    <Text style={{color: defaultColor}}>Done</Text>
                  </TouchableOpacity>
          ),
        });
      }, [navigation, selectedLocation]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleSelectLocation = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    return (
        <View style={styles.container}>
            <MapView 
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  onPress={handleSelectLocation}
            >
                {selectedLocation && (
            <Marker coordinate={selectedLocation} title="Selected Location" />
          )}
            </MapView>
        </View>
    );
}
export default MapViewScreen;

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