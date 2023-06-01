/* eslint-disable react/prop-types */
import React , {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../@types/RootStackPrams';
import {
  Container,
  Centered,
  MyTextInput,
  MyButton,
  MyButtonText,
  colors,
  placeholders,
  buttons,
  routes,
  MyText,
} from '../../shared';
import { verifyEmail } from '../../services/authService';
import { checkEmail } from '../../actions/authActions';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';

type forgetScreenProp = StackNavigationProp<RootStackParamList, 'ForgetPassword'>;

const ForgetPassword = () => {
  const navigation = useNavigation<forgetScreenProp>()
  const dispatch: AppDisPatch = useDispatch();
  const[email, setEmail] = useState('')
  const[message, setMessage] = useState('');

  const handleChangeEmail = (email: string) => {
    setEmail(email)
  }
  const handleMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }
  const handleSubmit = () => {
    verifyEmail(email)
      .then(() => {
        navigation.navigate('ConfirmPassword', {email: email});
      })
      .catch(err=>handleMessage(err.message))
  }

  return (
    <Container>
      <Centered>
        <MyText>{message}</MyText>
        <MyTextInput placeholder={placeholders.email} onChangeText={handleChangeEmail} />
        <MyButton onPress={handleSubmit}>
          <MyButtonText color={colors.bright}>Send</MyButtonText>
        </MyButton>
      </Centered>
    </Container>
  )
};

export default ForgetPassword;
