import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Animated,
  TextInput,
  StatusBar,
} from 'react-native';
import Spacer from '../components/spacer.component';

import {COLORS, FONTS} from '../assets/theme/theme';

import TextWrapper from '../components/text-wrapper.component';
import ModalComponent from '../components/modal.component';
import Center from '../components/center.component';
import Spinner from '../components/spinner.component';
import {fetchBookingDetailsFromPhone} from '../utils/api/yl.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryList from '../components/country-list.component';

import {useDispatch, useSelector} from 'react-redux';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {isValidNumber} from '../utils/isValidNumber';
import {phoneNumberLength} from '../utils/phoneNumbersLength';

import auth from '@react-native-firebase/auth';

const {width: deviceWidth} = Dimensions.get('window');
const IMAGE_WIDTH = deviceWidth * 0.7;
const IMAGE_HEIGHT = deviceWidth * 0.7;

// Main Component
const DemoClassScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState({callingCode: ''});

  const isTablet = deviceWidth > 540;

  const dispatch = useDispatch();

  const {ipData} = useSelector(bookDemoSelector);

  useEffect(() => {
    StatusBar.setBackgroundColor(COLORS.pgreen);
    StatusBar.setBarStyle('light-content');
  }, []);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  useEffect(() => {
    if (ipData) {
      setCountry({
        callingCode: ipData.calling_code,
        countryCode: {cca2: ipData.country_code2},
      });
    }
  }, [ipData]);

  const handlePhone = e => {
    const phoneRegex = /^[0-9]*$/;
    if (phoneRegex.test(e)) {
      setPhone(e);
    }
  };

  async function verifyPhoneNumber(phoneNumber) {
    const confirm = await auth().verifyPhoneNumber(
      `${country.callingCode}${phoneNumber}`,
    );
    console.log(
      '-------------------------------------------------------------------',
    );
    console.log(confirm);
    if (confirm) {
      confirmCode(confirm);
    }
  }

  // Handle confirm code button press
  async function confirmCode(confirm) {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      let userData = await auth().currentUser.linkWithCredential(credential);
      console.log(userData.user);
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  }

  const handleBookingStatus = async () => {
    if (!phone) {
      45;
      setErrorMsg('Enter phone number');
      return;
    }

    try {
      setLoading(true);
      const isValidPhone = isValidNumber(phone, country.countryCode.cca2);
      if (!isValidPhone) {
        setErrorMsg('Please enter a valid number');
        setLoading(false);
        return;
      }

      const response = await fetchBookingDetailsFromPhone(phone);

      if (response.status === 400) {
        setLoading(false);
        // Booking not found
        navigation.navigate('BookDemoForm', {phone});
        if (errorMsg) setErrorMsg('');
        return;
      }

      if (response.status === 200) {
        await AsyncStorage.setItem('phone', phone);
        await AsyncStorage.setItem('calling_code', country.callingCode);
        if (errorMsg) setErrorMsg('');
        navigation.replace('Main');
      }
      setLoading(false);
    } catch (error) {
      console.log('BOOKING_STATUS_WELCOME_SCREEN_ERROR', error);
    }
  };

  const handleSelectCountry = country => {
    let code = '';
    if (country.callingCode?.root && country.callingCode?.suffixes.length) {
      code = country.callingCode.root.concat(country.callingCode.suffixes[0]);
    }
    setCountry({
      callingCode: code,
      countryCode: {cca2: country.countryCode.cca2},
    });
    setVisible(false);
  };

  const onCloseBottomSheet = () => setVisible(false);

  // Animation stuff
  const SLOGN_TEXT = 'Helping parents raise capable, skillful & happy children';
  const [animatedValues, setAnimatedValues] = useState([]);
  const animatedButtons = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animations = [];
    SLOGN_TEXT.split(' ').forEach((_, i) => {
      animations[i] = new Animated.Value(0);
    });

    setAnimatedValues(animations);
  }, []);

  useEffect(() => {
    if (!animatedValues.length) return;

    const animations = SLOGN_TEXT.split(' ').map((_, i) => {
      return Animated.timing(animatedValues[i], {
        useNativeDriver: true,
        toValue: 1,
        duration: 500,
        delay: 800,
      });
    });

    Animated.stagger(200, animations).start();
  }, [animatedValues]);

  useEffect(() => {
    Animated.timing(animatedButtons, {
      useNativeDriver: true,
      toValue: 1,
      duration: 500,
      delay: 2800,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(imageAnim, {
      useNativeDriver: true,
      duration: 700,
      delay: 100,
      toValue: 1,
    }).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={{flex: isTablet ? 1 : 2}}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            position: 'relative',
            alignItems: isTablet ? 'flex-end' : 'center',
            justifyContent: isTablet ? 'flex-end' : 'center',
            paddingTop: 20,
          }}>
          <View>
            <Animated.Image
              source={require('../assets/images/YoungLabsLogo.png')}
              style={{
                alignSelf: 'center',
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                maxWidth: 240,
                maxHeight: 240,
                objectFit: 'contain',
                transform: [
                  {
                    translateY: imageAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                paddingBottom: 12,
              }}>
              {animatedValues.length > 0 &&
                SLOGN_TEXT.split(' ').map((word, index) => {
                  return (
                    <Animated.Text
                      key={word}
                      style={[
                        styles.animatedText,
                        {
                          opacity: animatedValues[index],
                          transform: [
                            {
                              translateY: Animated.multiply(
                                animatedValues[index],
                                new Animated.Value(-5),
                              ),
                            },
                          ],
                        },
                      ]}>
                      {word}
                      {index <= SLOGN_TEXT.split(' ').length ? ' ' : ''}
                    </Animated.Text>
                  );
                })}
            </View>
          </View>
        </View>
      </View>
      {/* Footer */}
      <Animated.View
        style={[
          {
            opacity: animatedButtons,
            flex: 1,
            maxHeight: 180,
            justifyContent: 'flex-start',
          },
        ]}>
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 16,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: '100%',
            justifyContent: 'center',
            elevation: 8,
          }}>
          <View style={styles.row}>
            <Pressable
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingHorizontal: 8,
              }}
              onPress={() => setVisible(p => !p)}>
              <TextWrapper>{country.callingCode}</TextWrapper>
            </Pressable>
            <TextInput
              placeholder="Enter phone number"
              style={styles.input}
              selectionColor={COLORS.black}
              value={phone}
              onChangeText={handlePhone}
              inputMode="numeric"
              placeholderTextColor={'gray'}
              maxLength={
                country?.countryCode &&
                (phoneNumberLength[country.countryCode.cca2] || 15)
              }
            />
          </View>
          {errorMsg && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {errorMsg}
            </TextWrapper>
          )}
          <Spacer space={12} />
          <Pressable
            style={({pressed}) => [
              styles.btnContinue,
              {opacity: pressed ? 0.8 : 1},
            ]}
            disabled={loading}
            onPress={handleBookingStatus}>
            <TextWrapper fs={18} fw="800" color={COLORS.white}>
              Continue
            </TextWrapper>
          </Pressable>
        </View>
      </Animated.View>
      <ModalComponent visible={loading}>
        <Center bg="rgba(0,0,0,0.25)">
          <Spinner />
        </Center>
      </ModalComponent>
      <CountryList
        visible={visible}
        onClose={onCloseBottomSheet}
        onSelect={handleSelectCountry}
      />
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topContainer: {
    flex: 2,
  },
  btnCtas: {
    width: '100%',
    maxWidth: 348,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    alignSelf: 'center',
  },
  animatedText: {
    fontSize: 20,
    color: COLORS.black,
    fontFamily: FONTS.gelasio_semibold,
    textTransform: 'capitalize',
    letterSpacing: 2.5,
    textAlign: 'center',
    lineHeight: 34,
  },
  btnRoundedClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 18,
    letterSpacing: 1.15,
    color: COLORS.black,
  },
  btnContinue: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pgreen,
    borderRadius: 54,
  },
});
