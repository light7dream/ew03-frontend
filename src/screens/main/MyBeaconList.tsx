import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useSelector, useDispatch} from 'react-redux'
import { AppDisPatch } from '../../store'
import { getBeacons, deleteBeacon } from '../../services/appService'
import {deleteBeacon as deletedBeacon, setBeacons} from '../../actions/appActions'
import { useColorSchemeListener } from '../../utils/useColorSchemeListener'
import Checkbox from 'react-native-check-box';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
   } from "react-native-popup-menu";


const BeaconListItem = (props: any) => {

    const [checked, setChecked] = useState(false);
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
            <View>
                <Checkbox onClick={()=>{setChecked(!checked); if(!checked) props.addList(props.device.id); else props.removeList(props.device.id);}} isChecked={checked} />
            </View>
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

export default function MyBeaconList({navigation}) {
    const dispatch = useDispatch<AppDisPatch>()
    const [enableCheckbox, setEnableCheckbox] = useState(false);
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
    const user = useSelector((state: any) => state.auth?.user);
    const bledevices = useSelector((state: any) => state.BLE.BLEList)
    const keys =  bledevices.map((bledevice: any) => (bledevice.id));
    const mybeacons = useSelector((state: any) => state.app.beacons)
    
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
                {
                selectedList.length> 0 && (
                    <>                               
                        <TouchableOpacity onPress={deleteBeacons} style={{padding: 4}}>
                            <MaterialIcons name='delete' size={26} color={defaultColor}/>
                        </TouchableOpacity>
                    </>
                )
                }
                {user.role=='admin' || user.role=='superadmin' && (
                <Menu>
                    <MenuTrigger
                    customStyles={{
                        triggerWrapper: {
                        marginHorizontal: 8
                        },
                    }}
                    >
                        <MaterialIcons name='control-point' size={32} color={defaultColor} />
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{backgroundColor: defaultBackgroundColor}}>
                    <MenuOption onSelect={() => {navigation.navigate('QrScan')}} customStyles={{optionText: {color: defaultColor}}} text='QR Scan'></MenuOption>
                    <MenuOption onSelect={() => {navigation.navigate('AddBeacon')}} customStyles={{optionText: {color: defaultColor}}}  text="Add manually"></MenuOption>
                    <MenuOption onSelect={() => {navigation.navigate('DeviceScan')}} customStyles={{optionText: {color: defaultColor}}}  text="Add via Bluetooth"></MenuOption>
                    </MenuOptions>
                </Menu>
                )}
            </View>
          ),
        });
      }, [navigation, selectedList]);

    const devices = 
        mybeacons.map((item: any) => {
            const device = {
                id: item._id,
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
                device.rssi = matchedBle?.rssi
                device.active = 1
            }
            return device
        }).sort((a, b) => b.active - a.active)

    useEffect(() => {
        getBeacons().then((res) => {
            dispatch(setBeacons(res.beacons));    
        })

    }, [selectedList])

    const addList = (id: string) => {
        setSelectedList([...selectedList, id])
    }   

    const removeList = (id: string) => {
        setSelectedList(selectedList.filter((item: any) => item !== id))
    }

    const deleteBeacons = async () => {
        for(var i in selectedList){
            try{
                await deleteBeacon(selectedList[i])
                await dispatch(deletedBeacon(selectedList[i]))
            }
            catch(err)
            {
                console.log(err)
            }
            
        }
        setSelectedList([]);
    }

  return (
    <View>
      <FlatList data={devices} renderItem={({item})=><BeaconListItem device={item} addList={addList} removeList={removeList} checkbox = {enableCheckbox} navigate={navigation.navigate} enableCheckbox={()=>setEnableCheckbox(true)} defaultBackgroundColor={defaultBackgroundColor} defaultColor={defaultColor} />} />
    </View>
  )

  const styles = S
}