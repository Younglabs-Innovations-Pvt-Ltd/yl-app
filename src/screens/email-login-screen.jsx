import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Pressable} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {COLORS} from '../utils/constants/colors';
import auth from '@react-native-firebase/auth';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

const EmailLogin = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginWithEmail = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password.trim());
      navigation.navigate(SCREEN_NAMES.MAIN);
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/user-not-found') {
        console.log('user not found');
      } else if (error.code === 'auth/wrong-password') {
        console.log('wrong password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter email"
            style={styles.input}
            selectionColor={COLORS.black}
            value={email}
            onChangeText={e => setEmail(e)}
            inputMode="email"
            placeholderTextColor={'gray'}
            autoCapitalize="none"
          />
        </View>
        <Spacer space={6.5} />
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter password"
            style={[styles.input, {fontSize: 16}]}
            selectionColor={COLORS.black}
            value={password}
            onChangeText={e => setPassword(e)}
            inputMode="text"
            secureTextEntry={true}
            placeholderTextColor={'gray'}
          />
        </View>
        <Spacer />
        <Pressable
          style={({pressed}) => [
            styles.btnSignup,
            {opacity: pressed ? 0.8 : 1},
          ]}
          onPress={loginWithEmail}>
          <TextWrapper fs={18} color={COLORS.white}>
            Log in
          </TextWrapper>
        </Pressable>
      </View>
    </View>
  );
};

export default EmailLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 38,
    paddingHorizontal: 16,
    alignItems: 'center',
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
