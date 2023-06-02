import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addBeacon } from '../../services/appService';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { addBeacon as addedBeacon } from '../../actions/appActions';
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyBM7oejbfOKFrGXvyH2fhYY5mBaNI71_J8");

export default function AddBeaconScreen({navigation, route}) {
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
  
    const disaptch: AppDisPatch = useDispatch();   
    const [name, setName] = useState('')
    const [mac, setMac] = useState(route.params?.uuid)
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState(route.params?.location);
    const [description, setDescription] = useState('');
    
    useEffect(()=>{
        if(location)
        Geocoder.from(location.lat, location.lng)
            .then(json => {
                var addressComponent = json.results[0].formatted_address;
                console.log(json.results[0].formatted_address)
                setAddress(addressComponent)
            })
            .catch(error => console.warn(error));
    },[])

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

    const handleSubmitAddress = () => {
        Geocoder.from(address)
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
            setLocation(location)
            Geocoder.from(location.lat, location.lng)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    console.log(json.results[0].formatted_address)
                    setAddress(addressComponent)
                })
                .catch(error => console.warn(error));
		})
		.catch(error => console.warn(error));
      };

    const handleSubmit = () => {
        addBeacon({name, mac, location, address, description})
            .then((res: any)=>{
                disaptch(addedBeacon(res.beacon));
                navigation.navigate('Beacons')
            })
            .catch(err=>console.log(err))
    }

  return (
    <View style={{padding: 12}}>
        {
        route.params?.location&&
        (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>{location?.lat}, {location?.lng}</Text>
            <View style={{alignItems: 'center'}}>
            <MaterialIcons name='place' size={36} />
            <Text style={{fontSize: 12, color: defaultColor}}>Location</Text>
            </View>
        </View>)}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Name</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} placeholder='Beacon name' textAlign='right' onChangeText={handleChangeName} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>MAC</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} textAlign='right' value={route.params?.uuid} placeholder='MAC' onChangeText={handleChangeMac}  />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Address</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} textAlign='right' value={address} placeholder='Address' onChangeText={handleChangeAddress} onSubmitEditing={handleSubmitAddress} />
        </View>
        {!route.params?.location&&(
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
        {
            location&&(
            <>
            <Text style={{fontSize: 16, color: defaultColor}}>{location.lat}, {location.lng}</Text>
            <TouchableOpacity onPress={()=>{
                navigation.navigate('MapView', {location: {
                    latitude: location.lat,
                    longitude: location.lng
                }})
            }} style={{borderRadius: 4, backgroundColor: '#3aa6ff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8}}>
                <MaterialIcons name='place' size={27} color={'#fff'} />
            </TouchableOpacity>
            </>
            )
        }
        </View>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16, color: defaultColor}}>Description</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160, color: defaultColor}} placeholderTextColor={defaultColor} textAlign='right' value={description} placeholder='Description' onChangeText={handleChangeDescription}  />
        </View>
        <View style={{borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 12}}>
            <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: '#2196f3', borderRadius: 8, padding: 10, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 16}}>Add</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}