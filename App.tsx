import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './src/@types/RootStackPrams';
import SignIn from './src/screens/auth/SignIn';
import SignUp from './src/screens/auth/SignUp';
import ForgetPassword from './src/screens/auth/ForgetPassword';
import ConfirmPassword from './src/screens/auth/ConfirmPassword';
import ConfirmSignUp from './src/screens/auth/ConfirmSignUp';
import DeviceScanScreen from './src/screens/main/DeviceScanScreen';
import QrScanScreen from './src/screens/main/QrScanScreen';
import DeviceListScreen from './src/screens/main/DeviceListScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import DetailsScreen from './src/screens/main/DetailsScreen';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BackHandler } from 'react-native';
import MyBeaconList from './src/screens/main/MyBeaconList';
import AddBeaconScreen from './src/screens/main/AddBeaconScreen';
import {useNavigation} from '@react-navigation/native';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import {Provider, useSelector} from 'react-redux';
import { store } from './src/store';
import AccountScreen from './src/screens/main/AccountScreen';
import { ScrollView } from 'react-native-gesture-handler';
import { Appearance, useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
const Stack = createStackNavigator<RootStackParamList>();

const Route = () => {
  const user = useSelector((state: any) => state.auth?.user);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';

  const MyTheme = {
    dark: isDarkMode,
    colors: isDarkMode ? DarkTheme.colors : DefaultTheme.colors,
  };
  return(
    <NavigationContainer theme={MyTheme}>
        <MenuProvider>
        <Stack.Navigator>
        {!user? (
          <Stack.Group navigationKey='public'>
            <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
            <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{headerShown: false}} />
            <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} options={{headerShown: false}} />
            <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUp} options={{headerShown: false}} />
          </Stack.Group>
        ):(
          <Stack.Group navigationKey='protected'>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: true, headerLeft: null, headerTitleAlign: 'center', headerRight: (props)=>(
              <TouchableOpacity 
              onPress={()=>{
                BackHandler.exitApp();
              }}
              style={{alignItems: 'center', marginRight: 8}}
              >
                <MaterialIcons name='logout' size={32} />
              </TouchableOpacity>
            )}} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{headerShown: true}} />
            <Stack.Screen name="Account" component={AccountScreen} options={{headerShown: true}} />
            <Stack.Screen name="Beacons" component={MyBeaconList} options={{headerShown: true, headerRight: (props) => {
              const navigation = useNavigation<RootStackParamList>();
              return(
                <View>
                  {user.role=='admin' || user.role=='superadmin' && (
                    <Menu>
                      <MenuTrigger
                        customStyles={{
                          triggerWrapper: {
                            top: 0,
                            left: -12
                          },
                        }}
                        >
                          <MaterialIcons name='control-point' size={32} />
                        </MenuTrigger>
                      <MenuOptions optionsContainerStyle={{backgroundColor: defaultBackgroundColor }}>
                        <MenuOption onSelect={() => {navigation.navigate('QrScan')}} text='Qr Scan'></MenuOption>
                        <MenuOption onSelect={() => {navigation.navigate('AddBeacon')}} text="Add manually"></MenuOption>
                        <MenuOption onSelect={() => {navigation.navigate('DeviceScan')}} text="Add via Bluetooth"></MenuOption>
                      </MenuOptions>
                    </Menu>
                  )}
                </View>
              )}}} />
            {user.role=='admin' || user.role=='superadmin' && (
            <>
              <Stack.Screen name="QrScan" component={QrScanScreen} options={{headerShown: true}} />
              <Stack.Screen name="AddBeacon" component={AddBeaconScreen} options={{headerShown: true}} />
              <Stack.Screen name="DeviceScan" component={DeviceScanScreen} options={{headerShown: true}} />
            </>
            )}
          </Stack.Group>
        )}
        </Stack.Navigator>
      </MenuProvider>
      </NavigationContainer>

  )
}

export default function App() {

  return (
    <Provider store={store}>
      <Route />
    </Provider>
  );
}
