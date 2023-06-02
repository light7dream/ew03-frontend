import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useSelector, useDispatch} from 'react-redux'
import { AppDisPatch } from '../../store'
import { getBeacons } from '../../services/appService'
import { setBeacons } from '../../actions/appActions'
import { useColorSchemeListener } from '../../utils/useColorSchemeListener'


const BeaconListItem = (props: any) => {

    return (
        <TouchableOpacity 
        style={{
            opacity: props.device?.active? 1 : 0.6,
            flexDirection: 'row', 
            padding: 8, 
            marginVertical: 1, 
            backgroundColor: props.defaultBackgroundColor, 
            alignItems: 'center', 
            justifyContent: 'space-between',
        }}
        >   
            <View style={{padding: 8, backgroundColor: props.defaultBackgroundColor, alignItems: 'center'}}>
                <MaterialIcons name={props.device?.active?'wifi':'wifi-off'} size={24} color={props.defaultColor} />
                <Text style={{fontSize: 12, color: props.defaultColor}}>{props.device?.rssi}</Text>
            </View>
            <View style={{
                flex: 2,
                marginLeft: 8
            }}>
                <Text style={{color: props.defaultColor}}>{props.device?.name}</Text>
                <Text style={{color: props.defaultColor}}>{props.device?.mac}</Text>
            </View>
            <View style={{
                flex: 1,
                marginLeft: 8
            }}>
                <Text style={{color: props.defaultColor}}>{props.device?.battery}%</Text>
            </View>
            <TouchableOpacity
                onPress={()=>{
                    if(!props.device.location)
                        return;
                    props.navigate('Details', {
                        device: props.device
                    })
                }}
                style={{
                    width: 36,
                    padding: 8,
                    alignItems: 'flex-end',
                    paddingLeft: 10,
                }}
                >
                <MaterialIcons
                    name='keyboard-arrow-right'
                    size={24}
                    color={props.defaultColor}
                />

                </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default function MyBeaconList({navigation}) {
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
    const dispatch = useDispatch<AppDisPatch>()
    const bledevices = useSelector((state: any) => state.BLE.BLEList)
    const keys =  bledevices.map((bledevice: any) => (bledevice.id));
    const mybeacons = useSelector((state: any) => state.app.beacons)
    console.log(mybeacons)

    const devices = 
    mybeacons.map((item: any) => {
        const device = {
            mac: item.mac,
            rssi: 0,
            name: item.name,
            location: item.location,
            address: item.address,
            description: item.description,
            battery: 0,
            active: 0
        }
        if(keys.includes(item.mac)){
            const matchedBle = bledevices.filter((ble: any) => ble.id === item.mac)[0];
            const location = matchedBle?.location;
            const battery = matchedBle?.battery;
            device.rssi = matchedBle?.rssi
            if(location) device.location = location
            if(battery) device.battery = battery
            device.active = 1
        }
        return device
    }).sort((a, b) => b.active - a.active)

    useEffect(() => {
        getBeacons().then((res) => {
            dispatch(setBeacons(res.beacons));    
        })
    }, [])
  return (
    <View>
      <FlatList data={devices} renderItem={({item})=><BeaconListItem device={item} navigate={navigation.navigate} defaultBackgroundColor={defaultBackgroundColor} defaultColor={defaultColor} />} />
    </View>
  )
}