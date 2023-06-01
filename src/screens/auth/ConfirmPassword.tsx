/* eslint-disable react/prop-types */
import React, {useState} from 'react';
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
} from '../../shared';
import { resetPassword } from '../../services/authService';


const ConfirmPassword = ({navigation, route}) => {
  const {email} = route.params;  
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const handleMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }
  const handleSubmit = () => {
    console.log(email)
    resetPassword(email, password)
      .then(()=>{
        navigation.navigate('SignIn')
      })
      .catch(err=>handleMessage(err.message))
  }

  const handleChangePassword = (password) => {
    setPassword(password)
  }

  return (
    <Container>
      <Centered>
        <MyTextInput placeholder={placeholders.newPassword} secureTextEntry={true} onChangeText={handleChangePassword} />      
        <MyButton onPress={handleSubmit}>
          <MyButtonText color={colors.bright}>{buttons.confirm}</MyButtonText>
        </MyButton>
      </Centered>
    </Container>
  )
};

export default ConfirmPassword;
