import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useSelector, useDispatch} from 'react-redux'
import { AppDisPatch } from '../../store'
import { getUsers, deleteUser } from '../../services/appService'
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
            opacity: 1,
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
                <Checkbox onClick={()=>{setChecked(!checked); if(!checked) props.addList(props.user.id); else props.removeList(props.user.id);}} isChecked={checked} />
            </View>
            <View style={{
                flex: 2,
                marginLeft: 8
            }}>
                <Text style={{color: props.defaultColor}}>{props.user?.name}</Text>
                <Text style={{color: props.defaultColor}}>{props.user?.email}</Text>
            </View>
            <View style={{
                flex: 2,
                marginLeft: 8
            }}>
                <Text style={{color: props.defaultColor}}>{props.user?.role}</Text>
                {/* <Text style={{color: props.defaultColor}}>{props.user?.createdAt}</Text> */}
            </View>
            <TouchableOpacity onPress={()=>{
                    props.navigate('UserEdit', {
                        id: props.user?.id,
                        name: props.user?.name,
                        email: props.user?.email,
                        role: props.user?.role,
                    })
                }} style={{padding: 4}}>
                <MaterialIcons name='edit' size={24} color={props.defaultColor}/>
            </TouchableOpacity>
          
        </TouchableOpacity>
    )
}

export default function Users({navigation}) {
    const dispatch = useDispatch<AppDisPatch>()
    const [enableCheckbox, setEnableCheckbox] = useState(false);
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
    const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
    const user = useSelector((state: any) => state.auth?.user);
    const [users, setUsers] = useState([]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
                {
                selectedList.length> 0 && (
                    <>                               
                        <TouchableOpacity onPress={deleteUsers} style={{padding: 4}}>
                            <MaterialIcons name='delete' size={26} color={defaultColor}/>
                        </TouchableOpacity>
                    </>
                )
                }
                <TouchableOpacity onPress={() => navigation.navigate("UserAdd")} style={{padding: 4}}>
                    <MaterialIcons name='control-point' size={32} color={defaultColor} />
                </TouchableOpacity>
                {/* <Menu>
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
                    <MenuOption onSelect={() => {navigation.navigate('QrScan')}} customStyles={{optionText: {color: defaultColor}}} text='New User'></MenuOption>
                    <MenuOption onSelect={() => {navigation.navigate('AddBeacon')}} customStyles={{optionText: {color: defaultColor}}}  text="Add manually"></MenuOption>
                    <MenuOption onSelect={() => {navigation.navigate('DeviceScan')}} customStyles={{optionText: {color: defaultColor}}}  text="Add via Bluetooth"></MenuOption>
                    </MenuOptions>
                </Menu>              */}
            </View>
          ),
        });
      }, [navigation, selectedList]);

    

    useEffect(() => {
        getUsers().then((res) => {
            setUsers(res.users);    
        }, [users])

    }, [selectedList])

    const addList = (id: string) => {
        setSelectedList([...selectedList, id])
    }   

    const removeList = (id: string) => {
        setSelectedList(selectedList.filter((item: any) => item !== id))
    }

    const deleteUsers = async () => {
        console.log("selectedList of users ", selectedList);
        // await deleteUser(selectedList).then((res: any) => {

        // }).catch((err) => {   console.log(err)  });
        // setSelectedList([]);
    }

  return (
    <View>
      <FlatList data={users} renderItem={({item})=><BeaconListItem user={item} addList={addList} removeList={removeList} checkbox = {enableCheckbox} navigate={navigation.navigate} enableCheckbox={()=>setEnableCheckbox(true)} defaultBackgroundColor={defaultBackgroundColor} defaultColor={defaultColor} />} />
    </View>
  )

}