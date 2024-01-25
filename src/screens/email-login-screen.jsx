import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {COLORS} from '../utils/constants/colors';
import auth from '@react-native-firebase/auth';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/storage/local-storage-keys';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {FONTS} from '../utils/constants/fonts';

const {width, height} = Dimensions.get('window');

const EmailLogin = ({navigation}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const loginWithEmail = async () => {
    try {
      if (!email || !password) {
        Showtoast({
          text: 'please Enter Your Credentials',
          toast,
          type: 'danger',
        });
        return;
      }
      setLoginLoading(true);
      await auth().signInWithEmailAndPassword(email, password.trim());
      localStorage.set(LOCAL_KEYS.EMAIL, email);
      localStorage.set(
        'loginDetails',
        JSON.stringify({
          loginType: 'customerLogin',
          email,
          password,
        }),
      );
      setLoginLoading(false);
      resetForm();
      navigation.navigate(SCREEN_NAMES.MAIN);
    } catch (error) {
      setLoginLoading(false);
      Showtoast({text: 'Email or Password Incorrect', toast, type: 'danger'});
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <View
        className="mt-4 mb-1 w-full items-center"
        style={{backgroundColor: COLORS.pblue}}>
        <Text
          className="text-center w-[95%] py-1"
          style={[FONTS.heading, {color: COLORS.white}]}>
          Enter your Younglabs Login Credentials To Continue
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputWrapper} className="relative">
          <TextInput
            style={[styles.input, {fontFamily: FONTS.primaryFont}]}
            selectionColor={COLORS.black}
            onChangeText={e => setEmail(e)}
            value={email}
            inputMode="email"
            className="w-full border rounded-md border-gray-400"
          />
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className="absolute text-[16px] bg-white -top-3 left-4 px-1 text-gray-500">
            Enter Email
          </Text>
        </View>

        <Spacer space={12} />

        <View style={styles.inputWrapper} className="relative">
          <TextInput
            style={[styles.input, {fontFamily: FONTS.primaryFont}]}
            selectionColor={COLORS.black}
            onChangeText={e => setPassword(e)}
            value={password}
            inputMode="text"
            className="w-full border rounded-md border-gray-400"
          />
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className="absolute text-[16px] bg-white -top-3 left-4 px-1 text-gray-500">
            Enter Password
          </Text>
        </View>

        {/* <View style={styles.inputWrapper}>
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
        </View> */}

        {/* <View style={styles.inputWrapper}>
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
        </View> */}
        <Spacer />
        <Pressable
          style={{backgroundColor: COLORS.pblue}}
          onPress={loginWithEmail}
          className={`rounded-full py-3 w-full items-center mt-4 flex-row justify-center`}>
          <TextWrapper fs={18} ff={FONTS.headingFont} color={COLORS.white}>
            {loginLoading ? 'Logging in' : 'Log in'}
          </TextWrapper>
          {loginLoading && (
            <ActivityIndicator
              color={'white'}
              size={25}
              className="text-white ml-2 "
            />
          )}
        </Pressable>
      </View>

      <View style={{alignItems: 'center', marginTop: 28}} className="mb-5">
        <Pressable
          style={{paddingVertical: 4}}
          onPress={() => navigation.navigate(SCREEN_NAMES.WELCOME)}>
          <TextWrapper fs={16} ff={FONTS.primaryFont} className="text-gray-600">
            Not a user? Sign in with Whatsapp
          </TextWrapper>
        </Pressable>

        <View className="my-3 border-t-[.7px] h-[1px] w-[80%] border-gray-400 relative">
          <Text className="absolute -top-3 bg-white px-1 left-[48%]">or</Text>
        </View>

        <Pressable
          style={{paddingVertical: 4}}
          onPress={() => navigation.navigate(SCREEN_NAMES.SIGNUP)}>
          <TextWrapper fs={16} ff={FONTS.primaryFont} className="text-gray-600">
            Signin with Email and Phone number
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
    // borderWidth: 1,
    // borderRadius: 4,
    // borderColor: COLORS.pblue,
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
