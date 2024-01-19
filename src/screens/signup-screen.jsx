import React, {useState} from 'react';
import {StyleSheet, Dimensions, View, TextInput, Pressable} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import Spacer from '../components/spacer.component';
import TextWrapper from '../components/text-wrapper.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {useDispatch} from 'react-redux';
import {fetchBookingStatusStart} from '../store/welcome-screen/reducer';

const {width: deviceWidth} = Dimensions.get('window');

const BASE_URL =
  'https://e125-2401-4900-415c-5347-d578-d1bd-ad36-7a16.ngrok-free.app';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();

  const fetchBookingDetails = () => {
    if (email && phone) {
      dispatch(fetchBookingStatusStart({phone, email}));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Phone number"
            style={styles.input}
            selectionColor={COLORS.black}
            value={phone}
            onChangeText={e => setPhone(e)}
            inputMode="numeric"
            placeholderTextColor={'gray'}
          />
        </View>
        <Spacer space={6.5} />
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
        <Spacer />
        <Pressable
          style={({pressed}) => [
            styles.btnSignup,
            {opacity: pressed ? 0.8 : 1},
          ]}
          onPress={fetchBookingDetails}>
          <TextWrapper fs={18} color={COLORS.white}>
            Signup
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
