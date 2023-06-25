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
import AuditScreen from './src/screens/main/AuditScreen';
import AuditGroup from './src/screens/main/AuditGroup';
import AuditGroupEdit from './src/screens/main/AuditGroupEdit';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BackHandler } from 'react-native';
import MyBeaconList from './src/screens/main/MyBeaconList';
import AuditBeaconList from './src/screens/main/AuditBeaconList';
import AddBeaconScreen from './src/screens/main/AddBeaconScreen';
import Users from './src/screens/main/Users';
import UserAdd from './src/screens/main/UserAdd';
import UserEdit from './src/screens/main/UserEdit';
import {useNavigation} from '@react-navigation/native';
import {Provider, useSelector} from 'react-redux';
import { store } from './src/store';
import AccountScreen from './src/screens/main/AccountScreen';
import { ScrollView } from 'react-native-gesture-handler';
import { Appearance, useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorSchemeListener } from './src/utils/useColorSchemeListener';
import MapViewScreen from './src/screens/main/MapViewScreen';
import { MenuProvider } from 'react-native-popup-menu';
import EditBeaconScreen from './src/screens/main/EditBeaconScreen';
const Stack = createStackNavigator<RootStackParamList>();
import { ToastProvider } from 'react-native-toast-notifications';

const Route = ({defaultBackgroundColor , defaultColor , MyTheme}) => {
  const user = useSelector((state: any) => state.auth?.user);

  return(
    <ToastProvider>
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
                <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: true, headerLeft: null, headerTitleAlign: 'center'}} />
                <Stack.Screen name="Details" component={DetailsScreen} options={{headerShown: true}} />
                <Stack.Screen name="Account" component={AccountScreen} options={{headerShown: true}} />
                <Stack.Screen name="MapView" component={MapViewScreen} options={{headerShown: true}} />
                <Stack.Screen name="Beacons" component={MyBeaconList} options={{headerShown: true}} />
                <Stack.Screen name="Audits" component={AuditScreen} options={{headerShown: true}}/>
                {user.role=='admin' || user.role=='superadmin' && (
                <>
                  <Stack.Screen name="QrScan" component={QrScanScreen} options={{headerShown: true}} />
                  <Stack.Screen name="AddBeacon" component={AddBeaconScreen} options={{headerShown: true}} />
                  <Stack.Screen name="EditBeacon" component={EditBeaconScreen} options={{headerShown: true}} />
                  <Stack.Screen name="DeviceScan" component={DeviceScanScreen} options={{headerShown: true}} />
                  <Stack.Screen name="AuditBeaconList" component={AuditBeaconList} options={{headerShown:true}} />
                  <Stack.Screen name="AuditGroup" component={AuditGroup} options={{headerShown:true}} />
                  <Stack.Screen name="AuditGroupEdit" component={AuditGroupEdit} options={{headerShown:true}} />
                  <Stack.Screen name="Users" component={Users} options={{headerShown:true}} />
                  <Stack.Screen name="UserAdd" component={UserAdd} options={{headerShown:true}} />
                  <Stack.Screen name="UserEdit" component={UserEdit} options={{headerShown:true}} />
                  
                </>
                )}
              </Stack.Group>
            )}
            </Stack.Navigator>
          </MenuProvider>
        </NavigationContainer>
    </ToastProvider>
  )
}

export default function App() {
  const colorScheme = useColorSchemeListener();
  const isDarkMode = colorScheme === 'dark';
  const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
  const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';

  const MyTheme = {
    dark: isDarkMode,
    colors: isDarkMode ? DarkTheme.colors : DefaultTheme.colors,
  };
  return (
    <Provider store={store}>
      <Route defaultBackgroundColor={defaultBackgroundColor} MyTheme={MyTheme} defaultColor={defaultColor}/>
    </Provider>
  );
}
