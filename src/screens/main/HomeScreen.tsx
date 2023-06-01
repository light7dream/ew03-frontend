import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux'
import { startScan } from '../../actions/bleActions';
import { Appearance } from 'react-native';

function ListMenuItem(props: any) {
const colorScheme = Appearance.getColorScheme();
const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
  return (
    <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
    }}
    >
      <TouchableOpacity
        onPress={props.onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        backgroundColor: defaultBackgroundColor
      }}
      >
        <View style={{backgroundColor: '#3a8fff', padding: 4, borderRadius: 100}}>
          <MaterialIcons name={props.icon} size={50} color={'white'}/>
        </View>
        <Text style={{color: '#3a8fff', marginTop: 4}}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}

interface timerState {
  isRunning: boolean;
  // add additional properties here if needed
}

function HomeScreen({navigation}) {

  const isRunning = useSelector((state: { timer: timerState }) => state?.timer?.isRunning);
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('Scanning')
    dispatch(startScan());
    let intervalId = setInterval(() => {
      console.log('...')
    }, 3000)
    
    return () => 
      clearInterval(intervalId)
    
  }, [isRunning])
  

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ListMenuItem title="My Devices" icon = 'where-to-vote' onPress={()=>{navigation.navigate('Beacons')}} />         
      <ListMenuItem title="Account" icon = 'perm-identity' onPress={()=>{navigation.navigate('Account')}} />         
      {/* <ListMenuItem title="Setting" icon = 'settings' onPress={()=>{}} />          */}
    </View>
  );
}

export default HomeScreen;