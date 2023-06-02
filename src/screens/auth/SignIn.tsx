/* eslint-disable react/prop-types */
import React, {useState} from 'react';
// import { AsyncStorage } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../@types/RootStackPrams';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';

import {View} from 'react-native'
import {
  Container,
  Centered,
  MyTextInput,
  MyButton,
  MyButtonText,
  MyText,
  messages,
  colors,
  placeholders,
  routes,
  buttons,
} from '../../shared';
import { FlexCentered } from '../../shared/styledComponents';
import { signIn } from '../../services/authService';
import { signIn as signedIn } from '../../actions/authActions';

type signInScreenProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<signInScreenProp>()
  const dispatch: AppDisPatch = useDispatch();

  const[email, setEmail] = useState('admin@doc.com')
  const[password, setPassword] = useState('123456')
  const[message, setMessage] = useState('')

  const onChangeEmail = (email: string) => {
    setEmail(email);
  }

  const onChangePassword = (password: string) => {
    setPassword(password);
  }

  const handleMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }
  // TODO: move this to utils
  const onSumbit = () => {
    signIn(email, password)
      .then((user)=>{
        dispatch(signedIn(user));
      })
      .catch(err=>{
        handleMessage(err.message)
      })
  };

  return (
    <Container>
      <Centered>
        <MyText>{message}</MyText>
        <MyTextInput placeholder={placeholders.email} onChangeText={onChangeEmail}  value={email}/>
        <MyTextInput placeholder={placeholders.password} secureTextEntry={true} onChangeText={onChangePassword} value={password}/>
        <MyButton onPress={onSumbit}>
          <MyButtonText>{buttons.login}</MyButtonText>
        </MyButton>
        <View style={{flexDirection:'row', marginTop: 21}}>
            <FlexCentered>
                <MyText onPress={() => navigation.navigate(routes.register)}>
                    {messages.register}
                </MyText>
            </FlexCentered>
            <FlexCentered>
                <MyText onPress={() => navigation.navigate(routes.forget)}>
                    {messages.forget}
                </MyText>
            </FlexCentered>
        </View>
      </Centered>
    </Container>
  );
};

export default SignIn;
