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
  MyText,
  MyButtonText,
  messages,
  colors,
  placeholders,
  routes,
  buttons,
} from '../../shared';
import { useDispatch } from 'react-redux';
import { AppDisPatch } from '../../store';
import { signUp } from '../../services/authService';

type signUpScreenProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp = () => {
  const navigation = useNavigation<signUpScreenProp>()
  const dispatch = useDispatch<AppDisPatch>();
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleChangeName = (name: string) => {
    setName(name)
  }
  const handleChangeEmail = (email: string) => {
    setEmail(email)
  }
  const handleChangePassword = (password: string) => {
    setPassword(password)
  }

  const handleMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }
  const handleSubmit = () => {
    signUp(email, name, password)
    .then(()=>{
      navigation.navigate('SignIn');
    })
    .catch((err)=>[
      handleMessage(err.message)
    ])
  }


  return (
    <Container>
      <Centered>
        
        <MyText>{message}</MyText>
        <MyTextInput placeholder={placeholders.username} onChangeText={handleChangeName} />
        <MyTextInput
          placeholder={placeholders.email}
          keyboardType="email-address"
          onChangeText={handleChangeEmail}
        />
        <MyTextInput placeholder={placeholders.password} onChangeText = {handleChangePassword} secureTextEntry={true} />
        {/* <MyTextInput placeholder={placeholders.phone} keyboardType="phone-pad" /> */}
        <MyButton onPress={handleSubmit}>
          <MyButtonText>SingUp</MyButtonText>
        </MyButton>
        <MyText onPress={() => navigation.navigate('SignIn')}>{messages.already}</MyText>
      </Centered>
    </Container>
  );
}
export default SignUp;
