import React, { useState, Fragment, useRef, useEffect } from 'react'
import { TouchableOpacity, Text, Linking, View, Image, ImageBackground, BackHandler, StyleSheet, TextInput, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { addBeacon } from '../../services/appService';
import { addBeacon as addedBeacon } from '../../actions/appActions';
import Geolocation from 'react-native-geolocation-service';
import { Appearance } from 'react-native';
import { useColorSchemeListener } from '../../utils/useColorSchemeListener';
import Geocoder from 'react-native-geocoding';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { checkMAC } from '../../services/appService';

Geocoder.init("AIzaSyBM7oejbfOKFrGXvyH2fhYY5mBaNI71_J8");
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;


const styles = StyleSheet.create({
    scrollViewStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#2196f3'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '10%',
        paddingLeft: 15,
        paddingTop: 10,
        width: deviceWidth,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 16,
        color: 'white'
    },
    textTitle1: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 16,
        color: 'white'
    },
    cardView: {
        width: deviceWidth - 32,
        height: deviceHeight - 350,
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        marginLeft: 5,
        marginRight: 5,
        marginTop: '10%',
    },
    scanCardView: {
        width: deviceWidth - 32,
        // height: deviceHeight - 200,
        alignSelf: 'center',
        justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    },
    buttonWrapper: {
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonScan: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#258ce3',
        paddingTop: 5,
        paddingRight: 25,
        paddingBottom: 5,
        paddingLeft: 25,
        marginTop: 20
    },
    buttonScan2: {
        marginLeft: deviceWidth / 2 - 50,
        width: 100,
        height: 100,
    },
    descText: {
        padding: 8,
        textAlign: 'center',
        fontSize: 16
    },
    highlight: {
        fontWeight: '700',
    },
    centerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        padding: 32,
        color: 'white',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    bottomContent: {
       width: deviceWidth,
       height: 120,
    },
    buttonTouchable: {
        fontSize: 21,
        marginTop: 32,
        width: deviceWidth - 62,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44
    },
    buttonTextStyle: {
        color: 'black',
        fontWeight: 'bold',
    }
});

const QrScanScreen = ({navigation, route}) => {
    const colorScheme = useColorSchemeListener();
    const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#eee';
    const defaultColor = colorScheme === 'dark' ? '#fff' : '#333';
    const [scan, setScan] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState();
    const [description, setDescription] = useState('');
    const [scanResult, setScanResult] = useState(false);
    const [result, setResult] = useState({});
    const [mac, setMac] = useState('')
    const [message, setMessage] = useState('')
    const scanner = useRef();
    const disaptch = useDispatch<AppDisPatch>();
    const toast = useToast();

    useEffect(() => {
        if(route.params?.location)
        {
            setLocation(route.params?.location)
        }
        else{
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        lat: latitude,
                        lng: longitude
                    })
                    Geocoder.from(latitude, longitude)
                    .then(json => {
                        var addressComponent = json.results[0].formatted_address;
                        console.log(json.results[0].formatted_address)
                        setAddress(addressComponent)
                    })
                    .catch(error => console.warn(error));
                },
                error => console.log(error),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            );
        }
      }, [route.params]);

    const handleMessage = (msg: string) => {
        setMessage(msg)
        setTimeout(() => setMessage(''), 3000)
      }

    const onSuccess = (e: any) => {
        setResult(e);
        setScan(false);
        setMac(e.data.split('=')[1]);
        
        checkMAC(e.data.split('=')[1]).then((res) => {
            if(res.exist){
                toast.show("The device already exists", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "zoom-in",
                });       
                
            } else {              
                setScanResult(true);
                // navigation.navigate('AddBeacon', {
                //     uuid: mac,
                //     back: 'DeviceScan'
                //   });
            }
        })
    }

    const activeQR = () => {
        setScan(true)    
    }

    const scanAgain = () => {
        setScan(true);
        setScanResult(false);
    }
    const handleChangeLat = (lat: string) => {
        setLocation({
            lat: lat,
            lng: location?.lng
        })
    }
    const handleChangeLng = (lng: string) => {
        setLocation({
            lat: location?.lat,
            lng: lng
        })
    }
    const handleChangeName = (name: string) => {
        setName(name)
    }

    const handleChangeDescription = (description: string) => {
        setDescription(description)
    }

    const handleChangeAddress = (addr: string) => {
        setAddress(addr)
    }

    const handleSubmitAddress = () => {
        Geocoder.from(address)
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
            setLocation(location)
            Geocoder.from(location.lat, location.lng)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    console.log(json.results[0].formatted_address)
                    setAddress(addressComponent)
                })
                .catch(error => console.warn(error));
		})
		.catch(error => console.warn(error));
      };

    const handleSubmit = () => {
        addBeacon({name, mac, location, description, address})
            .then((res) => {
                setScan(false);
                setScanResult(false)
                setResult(null)
                if(res.added){
                    disaptch(addedBeacon(res.beacon));
                } else {                    
                    toast.show("The device already exists", {
                        type: "danger",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "zoom-in",
                    });
                }
                navigation.navigate('Beacons');
            })
            .catch((err)=>handleMessage(err.message))
    }

  return (
      <View style={styles.scrollViewStyle}>
        <ScrollView>
        <Fragment>
            {!scan && !scanResult &&
                <View style={{...styles.cardView, backgroundColor: defaultBackgroundColor}} >
                    {/* <Image source={require('../../assets/camera.png')} style={{height: 48, width: 48}}></Image> */}
                    <Text numberOfLines={8} style={styles.descText}>Please move your camera {"\n"} over the QR Code</Text>
                    <Image source={require('../../assets/qr-code.png')} style={{margin: 8, width: 120, height: 120}}></Image>
                    <TouchableOpacity onPress={activeQR} style={styles.buttonScan}>
                        <View style={styles.buttonWrapper}>
                        <Image source={require('../../assets/camera.png')} style={{height: 36, width: 36}}></Image>
                        <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>Scan QR Code</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }
            {scanResult &&
                <Fragment>
                    <Text style={styles.textTitle1}>Result</Text>
                    <View style={{...(scanResult ? styles.scanCardView : styles.cardView), backgroundColor: defaultBackgroundColor, marginBottom: 12}}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>Name</Text>
                            <TextInput style={{borderBottomColor: '#000', borderBottomWidth: .3, minWidth: 160, maxWidth: deviceWidth-160}} onChangeText={handleChangeName} />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>MAC</Text>
                            <TextInput value={result?.data.split('=')[1]} style={{borderBottomColor: '#000', borderBottomWidth: .3, minWidth: 160, maxWidth: deviceWidth-160}} />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>Address</Text>
                            <TextInput value={address} style={{borderBottomColor: '#000', borderBottomWidth: .3, minWidth: 160, maxWidth: deviceWidth-160}} onChangeText={handleChangeAddress}/>
                        </View>
                        
                        <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, paddingTop: 8}}>
                            <Text style={{fontSize: 16, marginVertical: 4}}>Location</Text>
                        <View style={{borderColor: 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderStyle: 'dashed', margin: 2, flexDirection: 'row', justifyContent: 'flex-start', borderRadius: 2}}>
                            <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
                                <TouchableOpacity onPress={()=>{navigation.navigate('MapView', {
                                    location: {
                                        latitude: location.lat,
                                        longitude: location.lng
                                    },
                                    back: 'QR Scan'
                                })}} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 48, height: 48 ,backgroundColor: '#36a3ff', borderRadius: 4}}>
                                    <MaterialIcons name='location-on' size={32} color={'white'}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{padding: 8, flex: 2}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={{fontSize: 12, color: defaultColor}}>Lat</Text>
                                    <TextInput style={{marginLeft:8, width: '80%', color: defaultColor, fontSize: 10}}  textAlign='right' value={location?.lat?location?.lat+'': ''} placeholder='Latitude' onChangeText={handleChangeLat}/>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={{fontSize: 12, color: defaultColor}}>Long</Text>
                                    <TextInput style={{marginLeft:8, width: '80%', color: defaultColor, fontSize: 10}}  textAlign='right' value={location?.lng?location?.lng+'': ''} placeholder='Longtitude' onChangeText={handleChangeLng}/>
                                </View>
                            </View>
                        
                        </View>
                        </View>
                        {/* <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 8}}>
                            {
                                location&&(
                                <>
                                <Text style={{fontSize: 16}}>{location.lat}, {location.lng}</Text>
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate('MapView', {location: {
                                        latitude: location.lat,
                                        longitude: location.lng
                                    }})
                                }} style={{borderRadius: 4, backgroundColor: '#3aa6ff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8}}>
                                    <MaterialIcons name='place' size={27} color={'#fff'} />
                                </TouchableOpacity>
                                </>
                                )
                            }
                        </View> */}
                        
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>Description</Text>
                            <TextInput value={description} style={{borderBottomColor: '#000', borderBottomWidth: .3, minWidth: 160, maxWidth: deviceWidth-160}} onChangeText={handleChangeDescription} />
                        </View>
                        <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: '#2196f3', borderRadius: 8, padding: 8, marginTop: 16}}>
                            <View style={styles.buttonWrapper}>
                                <Text style={{...styles.buttonTextStyle, color: '#ffffff'}}>Add new beacon</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={scanAgain} style={styles.buttonScan}>
                            <View style={styles.buttonWrapper}>
                                {/* <Image source={require('../../assets/camera.png')} style={{height: 36, width: 36}}></Image> */}
                                <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>Click to scan again</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Fragment>
            }
            {scan &&
                <QRCodeScanner
                    reactivate={true}
                    showMarker={true}
                    ref={scanner}
                    onRead={onSuccess}
                    topContent={
                        <Text style={styles.centerText}>
                            {/* Please move your camera {"\n"} over the QR Code */}
                        </Text>
                    }
                    bottomContent={
                        <View>
                            <ImageBackground source={require('../../assets/bottom-panel.png')} style={styles.bottomContent}>
                                <TouchableOpacity style={styles.buttonScan2} 
                                    onPress={() => scanner.current.reactivate()} 
                                    onLongPress={() => setScan(false)}>
                                    <Image source={require('../../assets/camera2.png')}></Image>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                    }
                />
            }
        </Fragment>
        </ScrollView>
    </View>

  )
}

export default QrScanScreen
