import { View, Text, Dimensions } from 'react-native'
import React, {useState} from 'react'
import { MyButton, MyButtonText, MyText, MyTextInput } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccount } from '../../services/authService';
import { updateAccount as updatedAccount } from '../../actions/authActions';
import { AppDisPatch } from '../../store';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export default function AccountScreen() {
    const user = useSelector((state: any) => state.auth.user)
    const dispatch: AppDisPatch = useDispatch();
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangeName = (name: string) => {
        setName(name);
    }

    const handleChangePassword = (password: string) => {
        setPassword(password);
    }

    const handleMessage = (msg: string) => {
      setMessage(msg)
      setTimeout(() => setMessage(''), 3000)
    }

    const handleSubmit = () => {
      
        updateAccount(user.email, name, password)
          .then((res: any)=>{
            handleMessage(res.message);
            dispatch(updatedAccount(name));
          })
          .catch((error) => {
            handleMessage(error.message);
          })
    }

  return (
    <View style = {{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
      <MyText>{message}</MyText>
      <MyTextInput 
        placeholder={'Email'} 
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        value={user.email}
        editable={false}
        />
      <MyTextInput placeholder={'Name'} value={name} onChangeText={handleChangeName}/>
      <MyTextInput placeholder={'New password'} secureTextEntry={true} onChangeText={handleChangePassword}/>
      <MyButton onPress={handleSubmit}>
        <MyButtonText>Save</MyButtonText>
      </MyButton>
    </View>
  )
}