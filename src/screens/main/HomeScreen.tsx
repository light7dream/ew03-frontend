import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux'
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';
import { BackHandler } from 'react-native';

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
        padding: 8,
        marginHorizontal: 16,
        marginVertical: 6,
        backgroundColor: defaultBackgroundColor
      }}
      >
        <View style={{backgroundColor: '#3a8fff', padding: 8, borderRadius: 100}}>
          <MaterialIcons name={icon} size={42} color={'white'}/>
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
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.auth.user);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
              onPress={()=>{
                BackHandler.exitApp();
              }}
              style={{alignItems: 'center', marginRight: 8}}
              >
                <MaterialIcons name='logout' size={32} />
              </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    
  }, [])
  
  return (
    <ScrollView>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ListMenuItem title="Audit" icon = 'where-to-vote' onPress={()=>{navigation.navigate('Audits')}} defaultBackgroundColor={defaultBackgroundColor}/>         
      <ListMenuItem title="My Beacons" icon = 'add-location-alt' onPress={()=>{navigation.navigate('Beacons')}} defaultBackgroundColor={defaultBackgroundColor}/>         
      <ListMenuItem title="User Management" icon = 'users' onPress={()=>{navigation.navigate('Users')}} defaultBackgroundColor={defaultBackgroundColor}/>         
      <ListMenuItem title="Account" icon = 'perm-identity' onPress={()=>{navigation.navigate('Account')}} defaultBackgroundColor={defaultBackgroundColor}/>         
    </View>
    </ScrollView>
  );
}

export default HomeScreen;