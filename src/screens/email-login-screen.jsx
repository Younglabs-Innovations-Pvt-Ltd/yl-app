import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
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
import {useDispatch} from 'react-redux';
import {fetchUserFormLoginDetails} from '../store/auth/reducer';
import {CommonActions} from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmailLogin = ({route, navigation}) => {
  const params = route.params;
  const dispatch = useDispatch();
  const toast = useToast();
  const [email, setEmail] = useState(params?.email || '');
  const [password, setPassword] = useState(params?.password || '');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      dispatch(fetchUserFormLoginDetails());

      const resetActions = CommonActions.reset({
        index: 0,
        routes: [{name: SCREEN_NAMES.MAIN}],
      });
      navigation.dispatch(resetActions);
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
        className="pt-3 pb-4 mb-1 w-full items-center"
        style={{backgroundColor: COLORS.pblue}}>
        <Text
          className="text-center w-[95%] py-1"
          style={[FONTS.heading, {color: COLORS.white}]}>
          Enter your Younglabs login credentials to continue
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputWrapper} className="relative">
          <TextInput
            style={[
              styles.input,
              {
                fontFamily: FONTS.primaryFont,
                fontSize: 16,
                color: COLORS.black,
              },
            ]}
            selectionColor={COLORS.black}
            onChangeText={e => setEmail(e)}
            value={email}
            inputMode="email"
            className="w-full border rounded-md border-gray-400"
            autoCapitalize="none"
          />
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className="absolute text-[16px] bg-white -top-3 left-4 px-1 text-gray-500">
            Enter Email
          </Text>
        </View>

        <Spacer space={12} />

        <View style={styles.inputWrapper} className="relative">
          <View style={[styles.input]} className="relative w-full">
            <TextInput
              style={[
                {
                  fontFamily: FONTS.primaryFont,
                  fontSize: 16,
                  color: COLORS.black,
                },
              ]}
              selectionColor={COLORS.black}
              onChangeText={e => setPassword(e)}
              value={password}
              inputMode="text"
              className="w-full rounded-md border-gray-400 border py-3 pl-2 pr-[50px]"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <View className="absolute top-5  right-3 z-50">
              <MIcon
                name={!showPassword ? 'eye-off' : 'eye'}
                size={32}
                color={'gray'}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </View>
            <Text
              style={{fontFamily: FONTS.primaryFont}}
              className="absolute text-[16px] bg-white -top-0 left-4 px-1 text-gray-500">
              Enter Password
            </Text>
          </View>
        </View>
        <Spacer />
        <Pressable
          style={{backgroundColor: COLORS.pblue}}
          onPress={loginWithEmail}
          className={`rounded-full py-3 w-full items-center mt-4 flex-row justify-center`}>
          <TextWrapper fs={18} ff={FONTS.headingFont} color={COLORS.white}>
            Log in
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

      <View style={{alignItems: 'center', marginTop: 0}} className="mt-3 py-3">
        <Pressable
          style={{paddingVertical: 4}}
          onPress={() => navigation.navigate(SCREEN_NAMES.WELCOME)}>
          <TextWrapper fs={16} ff={FONTS.primaryFont} className="text-gray-600">
            Not a customer? Log in with Whatsapp.
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
    // flex: 1,
    paddingTop: 38,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
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
