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
import { createUser, checkEmail } from '../../services/appService';
import { useToast } from 'react-native-toast-notifications';

type signUpScreenProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const UserAdd = () => {
  const navigation = useNavigation<signUpScreenProp>()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast();

  const handleChangeName = (name: string) => {
    setName(name)
  }
  const handleChangeEmail = (email: string) => {
    setEmail(email)
  }
  const handleChangePassword = (password: string) => {
    setPassword(password)
  }

  const handleSubmit = () => {
        createUser(email, name, password)
            .then((res: any) => {
                if(res.email){
                
                    toast.show("The email already exists.", {
                        type: "danger",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "zoom-in",
                    });
                } else {
                    navigation.navigate('Users')
                }
            })
            .catch((err) => {
            })

  }


  return (
    <Container>
      <Centered>
{/*         
        <MyText>{message}</MyText> */}
        <MyTextInput placeholder={placeholders.username} onChangeText={handleChangeName} />
        <MyTextInput
          placeholder={placeholders.email}
          keyboardType="email-address"
          onChangeText={handleChangeEmail}
        />
        <MyTextInput placeholder={placeholders.password} onChangeText = {handleChangePassword} secureTextEntry={true} />
        {/* <MyTextInput placeholder={placeholders.phone} keyboardType="phone-pad" /> */}
        <MyButton onPress={handleSubmit}>
          <MyButtonText>Save</MyButtonText>
        </MyButton>
      </Centered>
    </Container>
  );
}
export default UserAdd;
