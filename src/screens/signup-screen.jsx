import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Pressable,
  Text,
} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import Spacer from '../components/spacer.component';
import TextWrapper from '../components/text-wrapper.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {useDispatch} from 'react-redux';
import {fetchBookingStatusStart} from '../store/welcome-screen/reducer';
import Input from '../components/CustomInputComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FONTS} from '../utils/constants/fonts';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';

const {width: deviceWidth} = Dimensions.get('window');

const BASE_URL =
  'https://e125-2401-4900-415c-5347-d578-d1bd-ad36-7a16.ngrok-free.app';

const Signup = ({navigation}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();

  const fetchBookingDetails = () => {
    if (!email || !phone) {
      Showtoast({
        text: 'Please Enter Phone Number and Email',
        toast,
        type: 'danger',
      });
      return;
    }
    if (email && phone) {
      dispatch(fetchBookingStatusStart({phone, email}));
    }
  };

  const resetForm = () => {
    setPhone('');
    setEmail('');
    Showtoast({text: 'Form reset', type: 'success', toast});
  };

  return (
    <View style={styles.container} className="py-2">
      <View
        className="mt-4 mb-9 w-full items-center"
        style={{backgroundColor: COLORS.pblue}}>
        <Text
          className="text-center w-[95%] py-1"
          style={[FONTS.heading, {color: COLORS.white}]}>
          Enter your Phone Number and Email address to Continue
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.inputWrapper} className="relative">
          <TextInput
            style={[styles.input, {fontFamily: FONTS.primaryFont}]}
            selectionColor={COLORS.black}
            onChangeText={e => setPhone(e)}
            value={phone}
            inputMode="numeric"
            className="w-full border-gray-400"
          />
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className="absolute text-[16px] bg-white -top-3 left-4 px-1 text-gray-500">
            Enter Phone Number
          </Text>
        </View>
        <Spacer space={12} />
        <View style={styles.inputWrapper} className="relative">
          <TextInput
            style={[styles.input, {fontFamily: FONTS.primaryFont}]}
            selectionColor={COLORS.black}
            onChangeText={e => setEmail(e)}
            value={email}
            inputMode="email"
            className="w-full border-gray-400"
          />
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className="absolute text-[16px] bg-white -top-3 left-4 px-1 text-gray-500">
            Enter Your Email
          </Text>
        </View>

        {/* <Spacer space={6.5} />
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
        </View> */}

        <Spacer />
        <View className="w-full justify-around flex-row">
          <Pressable
            style={{backgroundColor: 'white', borderColor: COLORS.pblue}}
            className="rounded-full py-3 items-center mt-5 w-[45%] border"
            onPress={() => resetForm()}>
            <TextWrapper fs={18} color={COLORS.pblue} ff={FONTS.headingFont}>
              Reset
            </TextWrapper>
          </Pressable>

          <Pressable
            style={{backgroundColor: COLORS.pblue}}
            className="rounded-full py-3 items-center mt-5 w-[45%]"
            onPress={fetchBookingDetails}>
            <TextWrapper fs={18} color={COLORS.white} ff={FONTS.headingFont}>
              Signup
            </TextWrapper>
          </Pressable>
        </View>
      </View>
      <View style={{alignItems: 'center'}} className="w-full mb-5">
        <Pressable
          style={{paddingVertical: 4}}
          onPress={() => navigation.navigate(SCREEN_NAMES.WELCOME)}>
          <TextWrapper fs={16} ff={FONTS.primaryFont} className="text-gray-600">
            Have WhatsApp? click here to login
          </TextWrapper>
        </Pressable>

        <View className="my-3 border-t-[.7px] h-[1px] w-[80%] border-gray-400 relative">
          <Text className="absolute -top-3 bg-white px-1 left-[48%]">or</Text>
        </View>

        <Pressable
          style={{paddingVertical: 4}}
          onPress={() => navigation.navigate(SCREEN_NAMES.EMAIL_LOGIN)}>
          <TextWrapper fs={16} ff={FONTS.primaryFont} className="text-gray-600">
            Existing user? Login with Email
          </TextWrapper>
        </Pressable>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
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
    borderRadius: 8,
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
