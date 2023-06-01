import React, { useState, Fragment, useRef } from 'react'
import { TouchableOpacity, Text, Linking, View, Image, ImageBackground, BackHandler, StyleSheet, TextInput } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { addBeacon } from '../../services/appService';
import { addBeacon as addedBeacon } from '../../actions/appActions';
import { Appearance } from 'react-native';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
const colorScheme = Appearance.getColorScheme();

const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';

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
        backgroundColor: defaultBackgroundColor
    },
    scanCardView: {
        width: deviceWidth - 32,
        height: deviceHeight / 2,
        alignSelf: 'center',
        justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        backgroundColor: defaultBackgroundColor
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
        backgroundColor: defaultBackgroundColor,
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

const QrScanScreen = () => {

    const [scan, setScan] = useState(false);
    const [name, setName] = useState('');
    const [scanResult, setScanResult] = useState(false);
    const [result, setResult] = useState({});
    const [mac, setMac] = useState('')
    const [message, setMessage] = useState('')
    const scanner = useRef();
    const disaptch = useDispatch<AppDisPatch>();

    const handleMessage = (msg: string) => {
        setMessage(msg)
        setTimeout(() => setMessage(''), 3000)
      }

    const onSuccess = (e: any) => {
        setResult(e);
        setScan(false);
        setScanResult(true);
        setMac(e.data.split('=')[1])
    }

    const activeQR = () => {
        setScan(true)    
    }

    const scanAgain = () => {
        setScan(true);
        setScanResult(false);
    }

    const handleChangeName = (name: string) => {
        setName(name)
    }
    const handleSubmit = () => {
        addBeacon({name, mac})
            .then((res) => {
                setScan(false);
                setScanResult(false)
                setResult(null)
                disaptch(addedBeacon(res.beacon));
            })
            .catch((err)=>handleMessage(err.message))
    }

  return (
    <View style={styles.scrollViewStyle}>
        <Fragment>
            {!scan && !scanResult &&
                <View style={styles.cardView} >
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
                    <View style={scanResult ? styles.scanCardView : styles.cardView}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>Name</Text>
                            <TextInput style={{borderBottomColor: '#000', borderBottomWidth: .2, minWidth: 160, maxWidth: deviceWidth-160}} onChangeText={handleChangeName} />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>MAC</Text>
                            <TextInput value={result?.data.split('=')[1]} style={{borderBottomColor: '#000', borderBottomWidth: .2, minWidth: 160, maxWidth: deviceWidth-160}} />
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
                            Please move your camera {"\n"} over the QR Code
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
    </View>

  )
}

export default QrScanScreen