import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addBeacon, updateBeacon } from '../../services/appService';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { updateBeacon as updatedBeacon } from '../../actions/appActions';
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
import { useToast } from 'react-native-toast-notifications';
Geocoder.init("AIzaSyBM7oejbfOKFrGXvyH2fhYY5mBaNI71_J8");
import { checkEditMAC } from '../../services/appService';

export default function EditBeaconScreen({navigation, route}) {
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';

    const disaptch: AppDisPatch = useDispatch();   
    const {id} = route.params;
    console.log(route.params)
    const [name, setName] = useState(route.params?.name)
    const [mac, setMac] = useState(route.params?.mac)
    const [address, setAddress] = useState(route.params?.address);
    const [location, setLocation] = useState(route.params?.location);
    const [description, setDescription] = useState(route.params?.description);

    const toast = useToast();
    useEffect(() => {
        if(!route.params?.location)
        {
            Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    lat: latitude,
                    lng: longitude
                })
                Geocoder.from(latitude, longitude)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    console.log(json.results[0].formatted_address)
                    setAddress(addressComponent)
                })
                .catch(error => console.warn(error));
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            );
        }else{
            setLocation(route.params?.location);
        }
        // toast.show("Hello World");
      }, [route.params]);

    const handleChangeName = (name: string) => {
        setName(name)
    }
    
    const handleChangeMac = (mac: string) => {
        setMac(mac)
    }
    
    const handleChangeDescription = (description: string) => {
        setDescription(description)
    }

    const handleChangeAddress = (addr: string) => {
        setAddress(addr)
    }
    const handleChangeLat = (lat: string) => {
        setLocation({
            lat: lat,
            lng: location?.lng
        })
    }
    const handleChangeLng = (lng: string) => {
        setLocation({
            lat: location?.lat,
            lng: lng
        })
    }

    const handleSubmit = () => {
        checkEditMAC(route.params?.id, mac).then((res) => {
            if(res.exist){
                toast.show("The device already exists.\n      Please input again.", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "zoom-in",
                });       
                
            } else {              
                
                updateBeacon(route.params?.id, {name, mac, location, address, description})
                    .then((res: any)=>{
                        console.log(res.beacon)
                        disaptch(updatedBeacon(res.beacon));
                        navigation.navigate('Beacons')
                    })
                    .catch(err=>console.log(err))
            }
        })
    }

  return (
    <ScrollView>
    <View style={{padding: 12}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Name</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} value={name} placeholder='Beacon name' textAlign='right' onChangeText={handleChangeName} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>MAC</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} textAlign='right' value={mac} placeholder='MAC' onChangeText={handleChangeMac}  />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Address</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} textAlign='right' value={address} placeholder='Address' onChangeText={handleChangeAddress} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Location</Text>
        </View>
        <View style={{borderColor: 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderStyle: 'dashed', margin: 2, flexDirection: 'row', justifyContent: 'flex-start', borderRadius: 2}}>
            <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
                <TouchableOpacity onPress={()=>{navigation.navigate('MapView', {
                    location: {
                        latitude: location.lat,
                        longitude: location.lng
                    },
                    back: 'EditBeacon'
                })}} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 72, height: 72 ,backgroundColor: '#36a3ff', borderRadius: 4}}>
                    <MaterialIcons name='location-on' size={56} color={'white'}/>
                </TouchableOpacity>
            </View>
            <View style={{padding: 8, flex: 2}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: defaultColor}}>Lat</Text>
                    <TextInput style={{marginLeft:8, width: '80%', color: defaultColor, fontSize: 10}}  textAlign='right' value={location?.lat?location?.lat+'': ''} placeholder='Latitude' onChangeText={handleChangeLat}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: defaultColor}}>Long</Text>
                    <TextInput style={{marginLeft:8, width: '80%', color: defaultColor, fontSize: 10}}  textAlign='right' value={location?.lng?location?.lng+'': ''} placeholder='Longtitude' onChangeText={handleChangeLng}/>
                </View>
            </View>
           
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Description</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}}  textAlign='right' value={description} placeholder='Description' onChangeText={handleChangeDescription}  />
        </View>
        <View style={{borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 12}}>
            <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: '#2196f3', borderRadius: 8, padding: 10, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 16}}>Save</Text>
            </TouchableOpacity>
        </View>
    </View>
    </ScrollView>

  )
}