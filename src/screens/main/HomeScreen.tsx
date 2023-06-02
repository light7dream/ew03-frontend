import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux'
import { startScan, stopScan } from '../../actions/bleActions';
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';

function ListMenuItem({defaultBackgroundColor, onPress, icon, title}) {

  return (
    <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
    }}
    >
      <TouchableOpacity
        onPress={onPress}
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
          <MaterialIcons name={icon} size={50} color={'white'}/>
        </View>
        <Text style={{color: '#3a8fff', marginTop: 4}}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

interface timerState {
  isRunning: boolean;
  // add additional properties here if needed
}

function HomeScreen({navigation}) {
  const colorScheme = useColorSchemeListener();
  const defaultBackgroundColor= colorScheme === 'dark' ? '#242424' : '#fff';
  const isRunning = useSelector((state: { timer: timerState }) => state?.timer?.isRunning);
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(startScan());
    let intervalId = setInterval(() => {
      dispatch(stopScan())
      dispatch(startScan())
    }, 10000)
    
    return () => 
      clearInterval(intervalId)
    
  }, [isRunning])
  
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ListMenuItem title="My Devices" icon = 'where-to-vote' onPress={()=>{navigation.navigate('Beacons')}} defaultBackgroundColor={defaultBackgroundColor}/>         
      <ListMenuItem title="Account" icon = 'perm-identity' onPress={()=>{navigation.navigate('Account')}} defaultBackgroundColor={defaultBackgroundColor}/>         
      {/* <ListMenuItem title="Setting" icon = 'settings' onPress={()=>{}} />          */}
    </View>
  );
}

export default HomeScreen;