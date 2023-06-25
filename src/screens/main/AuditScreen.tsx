import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Checkbox from 'react-native-check-box';
import React ,  { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector , useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { Menu, MenuOptions,  MenuOption, MenuTrigger } from "react-native-popup-menu";
import { getAllAuditGroups, deleteGroup } from '../../services/appService';
import { setAllAuditGroups , deletedGroup} from '../../actions/appActions';

const ListItem = ( props: any) => {
    const [checked, setChecked] = useState(false);
    return (
        <TouchableOpacity style={{  opacity: props.device?.active? 1 : 0.6,
            flexDirection: 'row', 
            padding: 8, 
            marginVertical: 1, 
            backgroundColor: '#fff', 
            alignItems: 'center', 
            justifyContent: 'space-between',}}>
            <View style={{flexDirection:"row",  alignItems: 'center',}}>
                <Checkbox  onClick={()=>{setChecked(!checked); if(!checked) props.addList(props.group._id); else props.removeList(props.group._id);}} isChecked={checked}/>
            </View>
            <View>
                <Text>{props.group.title}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity onPress={()=>{                 
                        props.navigate('AuditGroupEdit', {
                            groupid: props.group._id,
                            title: props.group.title
                        })
                    }} style={{padding: 4}}>
                        <MaterialIcons name='edit' size={24} color={props.defaultColor}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                        console.log(props.group._id)
                        if(!props.group._id)
                            return;
                        props.navigate('AuditGroup', {
                            groupid: props.group._id
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
            </View>

        </TouchableOpacity>
        
    )
}

export default function AuditScreen({ navigation }){
    const user = useSelector((state: any) => state.auth?.user);
    const dispatch = useDispatch<AppDisPatch>();
    const defaultBackgroundColor =  '#fff';
    const defaultColor = '#333';
    const groups = useSelector((state: any) => state.app.audits);
    const [selectedList, setSelectedList] = useState<string[]>([]);

    const createGroup = () => {
        navigation.navigate('AuditBeaconList');
    }
    const addList = (id: string) => {
        setSelectedList([...selectedList, id]);
        console.log(id);
    }
    const removeList = (id: string) => {
        setSelectedList(selectedList.filter((item: any) => item != id))
    }
    const deleteGroups = async () => {
        for(let i in selectedList){
            try{
                console.log("selected id = ", selectedList);
                await deleteGroup(selectedList[i])
                await dispatch(deletedGroup(selectedList[i]))
            }
            catch(err)
            {
                console.log(err)
            }
            
        }
        setSelectedList([]);
        console.log("selectedlist => ", selectedList);
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
                {
                selectedList.length> 0 && (
                    <>                               
                        <TouchableOpacity onPress={deleteGroups} style={{padding: 4}}>
                            <MaterialIcons name='delete' size={26} color={defaultColor}/>
                        </TouchableOpacity>
                    </>
                )
                }
                {user.role=='admin' || user.role=='superadmin' && (
                    <TouchableOpacity onPress={ createGroup } style={{padding: 4}}>
                        <MaterialIcons name='control-point' size={32} color={defaultColor} />    
                    </TouchableOpacity>           
                )}
            </View>
          ),
        });
      }, [navigation, selectedList]);
      
    useEffect(() => {
        getAllAuditGroups().then((res) => {
            console.log(res.groups);
            dispatch(setAllAuditGroups(res.groups));   
             
        })
      }, [selectedList])

    return (
        // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View>
            <FlatList data={groups} renderItem={ ({item})  => <ListItem group={item} addList={addList} removeList={removeList} 
                navigate={navigation.navigate} /> }/>
        </View>
    )
}

// const styles = StyleSheet.create({
//     container: {
//         // opacity: props.device?.active? 1 : 0.6,
//         // flexDirection: 'row', 
//         padding: 8, 
//         marginVertical: 1, 
//         backgroundColor: '#fff',
//         // alignItems: 'center', 
//         // justifyContent: 'space-between',
//     },
//     title: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     data: {
//         color: 'red',
//         flexDirection: 'row',
//     },
//     dataitem: {
//         flexDirection: 'row',
//         paddingLeft: 10
//     },
//     datacontent:{
//         fontSize: 10,
//     }
    
//   });