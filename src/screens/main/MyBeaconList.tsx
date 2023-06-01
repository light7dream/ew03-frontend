import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useSelector, useDispatch} from 'react-redux'
import { AppDisPatch } from '../../store'
import { getBeacons } from '../../services/appService'
import { setBeacons } from '../../actions/appActions'


const BeaconListItem = (props: any) => {

    return (
        <TouchableOpacity 
        style={{
            flexDirection: 'row', 
            padding: 8, 
            marginVertical: 1, 
            backgroundColor: 'white', 
            alignItems: 'center', 
            justifyContent: 'space-between'
        }}
        >   
            <View style={{padding: 8}}>
                <MaterialIcons name='wifi' size={24} style={{}} />
                <Text style={{fontSize: 12}}>{props.beacon?.device.rssi}</Text>
            </View>
            <View style={{
                flex: 1,
                marginLeft: 8
            }}>
                <Text>{props.beacon?.myname}</Text>
                <Text>{props.beacon?.device.id}</Text>
            </View>
            <TouchableOpacity
                onPress={()=>{
                    props.navigate('Details', {
                        device: props.beacon
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
                />

                </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default function MyBeaconList({navigation}) {

    const dispatch = useDispatch<AppDisPatch>()

    useEffect(() => {
        getBeacons().then((res) => {
            dispatch(setBeacons(res.beacons));    
        })
    }, [])

    const bledevices = useSelector((state: any) => state.BLE.BLEList)
    const mybeacons = useSelector((state: any) => state.app.beacons)
    const keys =  mybeacons.map((bledevice: any)=>bledevice.mac);
    const devices = bledevices.filter((item: any) => keys.includes(item.id)).map((item: any) => {
        const name = mybeacons.filter((mybeacon: any) => mybeacon.mac === item.id)[0].name;
        return {myname: name, device: item}
    })

  return (
    <View>
      <FlatList data={devices} renderItem={({item})=><BeaconListItem beacon={item} navigate={navigation.navigate} />} />
    </View>
  )
}