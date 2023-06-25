import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useSelector, useDispatch} from 'react-redux'
import { AppDisPatch } from '../../store'
import { getBeacons, getGroupBeacons, deleteBeacon} from '../../services/appService'
import {deleteBeacon as deletedBeacon, setBeacons} from '../../actions/appActions'
import { useColorSchemeListener } from '../../utils/useColorSchemeListener'
import Checkbox from 'react-native-check-box';


const BeaconListItem = (props: any) => {

    // const [checked, setChecked] = useState(false);
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
        onLongPress={props.enableCheckbox}
        >   
            {/* <View>
                <Checkbox onClick={()=>{setChecked(!checked); if(!checked) props.addList(props.device.id); else props.removeList(props.device.id);}} isChecked={checked} />
            </View> */}
            <View style={{
                flex: 2,
                marginLeft: 8
            }}>
                <Text style={{color: props.defaultColor}}>{props.device?.name}</Text>
                <Text style={{color: props.defaultColor}}>{props.device?.mac}</Text>
            </View>
            <TouchableOpacity onPress={()=>{
                console.log(props.device)
                    props.navigate('EditBeacon', {
                        id: props.device?.id,
                        name: props.device?.name,
                        mac: props.device?.mac,
                        address: props.device?.address,
                        location: props.device?.location,
                        description: props.device?.description
                    })
                }} style={{padding: 4}}>
                    <MaterialIcons name='edit' size={24} color={props.defaultColor}/>
                </TouchableOpacity>
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

export default function AuditGroup({navigation, route}) {
    const groupid = route.params.groupid;
    const dispatch = useDispatch<AppDisPatch>()
    const [enableCheckbox, setEnableCheckbox] = useState(false);
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
    const user = useSelector((state: any) => state.auth?.user);
    const bledevices = useSelector((state: any) => state.BLE.BLEList)
    const keys =  bledevices.map((bledevice: any) => (bledevice.id));
    const [beacons, setBeacons] = useState<any>([]);
    
    // const devices = 
    //     beacons.map((item: any) => {
    //         const device = {
    //             id: item._id,
    //             mac: item.mac,
    //             rssi: 0,
    //             name: item.name,
    //             location: item.location,
    //             address: item.address,
    //             description: item.description,
    //             groupid: item.groupid,
    //             battery: 0,
    //             active: 0
    //         }
    //         if(keys.includes(item.mac)){
    //             const matchedBle = bledevices.filter((ble: any) => ble.id === item.mac)[0];
    //             device.rssi = matchedBle?.rssi
    //             device.active = 1
    //         }
    //         return device
    //     }).sort((a, b) => b.active - a.active)

    useEffect(() => {
        getGroupBeacons(groupid).then((res) => {
            dispatch(setBeacons(res.beacons));    
        })

    }, [selectedList])

  return (
    <View>
      <FlatList data={beacons} renderItem={({item})=><BeaconListItem device={item} checkbox = {enableCheckbox} navigate={navigation.navigate} enableCheckbox={()=>setEnableCheckbox(true)} defaultBackgroundColor={defaultBackgroundColor} defaultColor={defaultColor} />} />
    </View>
  )


}