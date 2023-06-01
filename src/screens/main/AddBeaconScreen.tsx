import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addBeacon } from '../../services/appService';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { addBeacon as addedBeacon } from '../../actions/appActions';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;


export default function AddBeaconScreen({navigation, route}) {

    const [name, setName] = useState('')
    const [mac, setMac] = useState(route.params?.uuid)
    const disaptch: AppDisPatch = useDispatch();

    const handleChangeName = (name: string) => {
        setName(name)
    }
    
    const handleChangeMac = (mac: string) => {
        setMac(mac)
    }
    
    const handleSubmit = () => {
        addBeacon({name, mac})
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
            <Text style={{fontSize: 16}}>{route.params.location?.long}, {route.params.location?.lang}</Text>
            <View style={{alignItems: 'center'}}>
            <MaterialIcons name='place' size={36} />
            <Text style={{fontSize: 12}}>Location</Text>
            </View>
        </View>)}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16}}>Name</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160}} placeholder='Beacon name' textAlign='right' onChangeText={handleChangeName} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 6}}>
            <Text style={{fontSize: 16}}>MAC</Text>
            <TextInput style={{minWidth: deviceWidth-160, maxWidth: deviceWidth-160}} textAlign='right' value={route.params?.uuid} placeholder='MAC' onChangeText={handleChangeMac}  />
        </View>
        <View style={{borderBottomColor: '#bbb', borderBottomWidth: 0.2, padding: 12}}>
            <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: '#2196f3', borderRadius: 8, padding: 8, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 16}}>Add</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}