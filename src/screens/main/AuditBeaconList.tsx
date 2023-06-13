import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import {
    Container,
    Centered,
    MyTextInput,
    MyButton,
    MyButtonText,
    MyText,
    messages,
    colors,
    placeholders,
    routes,
    buttons,
  } from '../../shared';
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useSelector, useDispatch} from 'react-redux'
import { AppDisPatch } from '../../store'
import { getBeacons, deleteBeacon, saveAuditGroup , } from '../../services/appService'
import {deleteBeacon as deletedBeacon, setBeacons,addedGroup} from '../../actions/appActions'
import { useColorSchemeListener } from '../../utils/useColorSchemeListener'
import Checkbox from 'react-native-check-box';


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
            justifyContent: 'space-around',
        }}
        onLongPress={props.enableCheckbox}
        >   
            <View style={{
                flex: 2,
                marginLeft: 8
            }}>
                <Text style={{color: props.defaultColor}}>{props.device?.name}</Text>
                <Text style={{color: props.defaultColor}}>{props.device?.mac}</Text>
            </View>
            <View><Text>Group1</Text></View>
            <View>
                <Checkbox onClick={()=>{setChecked(!checked); if(!checked) props.addList(props.device.id); else props.removeList(props.device.id);}} isChecked={checked} />
            </View>
           
        
        </TouchableOpacity>
    )
}

export default function AuditBeaconList({navigation}) {

    const [title, setTitle] = useState("");
    const onSave = () => {
        saveAuditGroup(title, selectedList).then((res) => {
            dispatch(addedGroup(res.group)); 
            navigation.navigate("Audits");
            console.log("selected Lists are ", selectedList);
        })
    }
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
        <View style={styles.title_container}>
            <TextInput placeholder={"Input title"} onChangeText={(t:string) => setTitle(t)} value={title} style={styles.title_ipt}/>
            <TouchableOpacity onPress={onSave} style={styles.save_btn}>
                <Text style={styles.save_btn_txt}>Save</Text>
            </TouchableOpacity>            
        </View>
        <FlatList data={devices} renderItem={({item})=><BeaconListItem device={item} addList={addList} removeList={removeList} checkbox = {enableCheckbox} navigate={navigation.navigate} enableCheckbox={()=>setEnableCheckbox(true)} defaultBackgroundColor={defaultBackgroundColor} defaultColor={defaultColor} />} />
    </View>
  )  
}
const { width } = Dimensions.get('screen');
const styles = StyleSheet.create({
    title_container:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 8, 
        marginVertical: 1, 
        backgroundColor: "#fff", 
    },
    title_ipt: {
        fontSize: 14,
        borderColor: colors.blue,
        borderWidth: 1,
        borderRadius: 20,
        height: 40,
        width: width * 0.6,
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },
    save_btn: {
        backgroundColor: colors.blue,
        width: width * 0.3,
        height: 40,
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 16,
        // marginTop: 16,
    },
    save_btn_txt: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.bright
        
    }

});