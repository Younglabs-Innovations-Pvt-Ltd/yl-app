import React, {useState} from 'react';
import {StyleSheet, TextInput, Pressable, View} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {COLORS} from '../utils/constants/colors';
import auth from '@react-native-firebase/auth';

const BASE_URL =
  'https://e125-2401-4900-415c-5347-d578-d1bd-ad36-7a16.ngrok-free.app';

const VerifyCode = ({route}) => {
  const params = route.params;
  const [code, setCode] = useState('');

  console.log(params);

  const verifyOtp = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/emailAndSms/verifyEmailOTP`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({code, messageId: params.messageId}),
        },
      );

      const data = await response.json();

      if (data.status === 'verified') {
        console.log(data);

        await auth()
          .createUserWithEmailAndPassword(params.email, params.password)
          .then(() => {
            console.log('User account created & signed in!');
          });
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter otp"
          style={styles.input}
          selectionColor={COLORS.black}
          value={code}
          onChangeText={e => setCode(e)}
          inputMode="numeric"
          placeholderTextColor={'gray'}
        />
      </View>

      <Spacer />
      <Pressable
        style={({pressed}) => [styles.btnSignup, {opacity: pressed ? 0.8 : 1}]}
        onPress={verifyOtp}>
        <TextWrapper fs={18} color={COLORS.white}>
          Signup
        </TextWrapper>
      </Pressable>
    </View>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16.5,
    letterSpacing: 1.15,
    color: COLORS.black,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.pblue,
  },
  btnSignup: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.pblue,
    borderRadius: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
});
