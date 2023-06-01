import { FlatList, StyleSheet, Text, View} from 'react-native'
import React, { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import useBle from '../../useBle'
import { useSelector } from 'react-redux'
import { getBeacons } from '../../services/appService'
import { setBeacons } from '../../actions/appActions'



const ListDeviceItem = (props: any) => {
  return (
    <TouchableOpacity style={{
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 8, 
      marginVertical: 1,
      backgroundColor: '#ffffff',
      shadowColor: '#242424'
    }}
      >
      <View style={{padding: 8}}>
          <MaterialIcons name='wifi' size={24} style={{}} />
          <Text style={{fontSize: 12}}>{props.device?.rssi}</Text>
      </View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
        <View style={{flex: 1, justifyContent: 'space-around', marginLeft: 4}}>
          <Text style={{fontSize: 18}}>{props?.device?.name}</Text>
          <Text style={{fontSize: 12}}>{props?.device?.id}</Text>
        </View>
        <Text>{props?.device?.txPowerLevel}</Text>
        <TouchableOpacity
          onPress={()=>{
            const {device, navigation} = props;
            // bleManager.connectToDevice(device.id, {autoConnect:true})
            //   .then((device: any) => {
            //     navigation.navigate('Details', {
            //       device: device
            //     });
            //   })
              navigation.navigate('AddBeacon', {
                uuid: device?.id,
                location:device.location
              });
          }}
          style={{
            width: 48,
            padding: 8,
            alignItems: 'center',
            paddingLeft: 10
          }}
        >
          <MaterialIcons
            name='keyboard-arrow-right'
            size={25}
          />

        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const DeviceScanScreen = ({navigation, route}) => {

  const bledevices = useSelector((state: any) => state.BLE.BLEList)
  const mybeacons = useSelector((state: any) => state.app.beacons)
  const keys =  mybeacons.map((bledevice: any)=>bledevice.mac);
  const devices = bledevices.filter((item: any) => !keys.includes(item.id))

  const [devices_, setDevices_] = useState([
    {
      name: 'Beacon #1',
      uuid: 'C9:16:59:E9:08:01',
      rssi: -73,
      location: {
          long: 23.56344,
          lang: 34.56342
      }
    },
    {
      name: 'Beacon #2',
      uuid: 'A9:36:42:F3:38:C1',
      rssi: -57,
      location: {
          long: 33.56344,
          lang: 34.56342
      }
    }
  ]);

  return (
    <View>
      <FlatList 
        data={devices}
        renderItem={({item})=>(<ListDeviceItem device={item} navigation={navigation} />)}
      />
    </View>
  )
}

export default DeviceScanScreen

const styles = StyleSheet.create({})