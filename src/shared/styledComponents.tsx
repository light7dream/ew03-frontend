import { Dimensions, SafeAreaView, StyleSheet, View, TextInput, Text, Pressable, TouchableOpacity } from 'react-native';
import React from 'react'
import { colors, placeholders } from './constants';
import { Appearance } from 'react-native';
import { useColorSchemeListener } from '../utils/useColorSchemeListener';

const { width } = Dimensions.get('screen');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCentered: {
    alignItems: 'center',
    flex: 1
  },
  textInput: {
    fontSize: 18,
    borderColor: colors.bright,
    borderWidth: 0.5,
    borderRadius: 30,
    height: 55,
    width: width * 0.9,
    padding: 16,
    paddingLeft: 24,
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    backgroundColor: colors.blue,
    width: width * 0.9,
    height: 55,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.bright
  }
});


export function Container(props: any) {
  const colorScheme = useColorSchemeListener();
  const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#eee';
  return (
    <SafeAreaView style={{...styles.container, backgroundColor: defaultBackgroundColor}} {...props}>{props.children}</SafeAreaView>
  )
};

export function Centered(props: any) {
  const colorScheme = useColorSchemeListener();
  const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#eee';
  return (
    <View style={{...styles.centered, backgroundColor: defaultBackgroundColor}} {...props}>{props.children}</View>
  )
};

export function FlexCentered(props: any) {
  const colorScheme = useColorSchemeListener();
  const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#eee';
  return (
    <Centered style={{...styles.flexCentered, backgroundColor: defaultBackgroundColor}} {...props}>{props.children}</Centered>
  )
};

export function MyTextInput(props: any) {
  const colorScheme = useColorSchemeListener();
  const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
  const defaultBackgroundColor = colorScheme === 'dark' ? '#242424' : '#fff';
  return (
    <TextInput style={{...styles.textInput, backgroundColor: defaultBackgroundColor, color: defaultColor}} placeholderTextColor={defaultColor} autoCorrect = {true} autoCapitalize='none' keyboardType={props.keyboardType} returnKeyType='done' placeholder={props.placeholder} secureTextEntry={props.secureTextEntry} onChangeText={props.onChangeText} textContentType={props.textContentType} autoCompleteType={props.autoCompleteType} {...props} />
  )
};

export function MyButton(props: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  )
};

export function MyText(props: any) {
  const colorScheme = useColorSchemeListener();
  const defaultColor = colorScheme === 'dark' ? '#eee' : '#333';
  return (
    <Text style={{...styles.text, color: defaultColor}} {...props}></Text>
  )
};
export function MyButtonText(props: any) {
  return (
    <Text style={styles.buttonText} {...props}></Text>
  )
};
