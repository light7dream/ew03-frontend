/* eslint-disable react/prop-types */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../@types/RootStackPrams';
import {
  Container,
  MyTextInput,
  MyText,
  MyButton,
  MyButtonText,
  Centered,
} from '../../shared/styledComponents';

import { colors, placeholders, routes, buttons } from '../../shared/constants';

type confirmSignUpScreenProp = StackNavigationProp<RootStackParamList, 'ComfirmSignUp'>;

const ConfirmSignUp = () => {
const navigation = useNavigation<confirmSignUpScreenProp>()

 return (
    <Container>
      <Centered>
        <MyTextInput placeholder={placeholders.code} keyboardType="number-pad" />
      
        <MyButton onPress={() => navigation.navigate(routes.app)}>
          <MyButtonText color={colors.bright}>{buttons.confirm}</MyButtonText>
        </MyButton>
        <MyButton>
          <MyButtonText color={colors.bright}>{buttons.resend}</MyButtonText>
        </MyButton>
      </Centered>
    </Container>
)

};

export default ConfirmSignUp;
