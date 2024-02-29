import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Animated,
  TextInput,
  ImageBackground,
  Alert,
  Text,
} from 'react-native';

import {FONTS} from '../utils/constants/fonts';
import {COLORS} from '../utils/constants/colors';
import {IMAGES} from '../utils/constants/images';

import TextWrapper from '../components/text-wrapper.component';
import ModalComponent from '../components/modal.component';
import Center from '../components/center.component';
import Spinner from '../components/spinner.component';
import CountryList from '../components/country-list.component';

import {useDispatch, useSelector} from 'react-redux';
import {
  setCountry,
  fetchBookingStatusStart,
  setCustomer,
  setErrorMessage,
} from '../store/welcome-screen/reducer';

import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';

import {i18nContext} from '../context/lang.context';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import Icon from '../components/icon.component';
import {networkSelector} from '../store/network/selector';
import Spacer from '../components/spacer.component';
import Seperator from '../components/seperator.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width: deviceWidth} = Dimensions.get('window');

// Main Component
const DemoClassScreen = ({navigation}) => {
  const toast = useToast();
  const {colorYlMain, textColors} = useSelector(state => state.appTheme);
  const {localLang, currentLang} = i18nContext();
  const [phone, setPhone] = useState('');
  const [visible, setVisible] = useState(false);
  const [loginWithWhatsapp, setLoginWithWhatsapp] = useState(true);
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const dispatch = useDispatch();

  const {ipData} = useSelector(bookDemoSelector);
  const {country, loading, customer, message} = useSelector(
    welcomeScreenSelector,
  );

  const {
    networkState: {isConnected},
  } = useSelector(networkSelector);

  // show message to customer to login with right credentials (email and password)
  useEffect(() => {
    if (customer === 'yes') {
      Showtoast({
        text: 'You are an existing customer click on Customer LogIn',
        toast,
        type: 'danger',
      });

      dispatch(setCustomer(''));
    }
  }, [customer]);

  // Retry fetch ipData if network is available
  useEffect(() => {
    if (isConnected && !ipData) {
      dispatch(startFetchingIpData());
    }
  }, [isConnected, ipData]);

  // fetch ipData
  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }

    if (ipData) {
      dispatch(
        setCountry({
          callingCode: ipData.calling_code,
          countryCode: {cca2: ipData.country_code2},
        }),
      );
    }
  }, [ipData]);

  useEffect(() => {
    if (message) {
      Showtoast({text: message, toast, type: 'danger'});
      dispatch(setErrorMessage(''));
    }
  }, [message]);

  const handlePhone = e => {
    const phoneRegex = /^[0-9]*$/; // Check for only number enters in input
    if (phoneRegex.test(e)) {
      setPhone(e);
    }
  };

  // Show and hide country list
  const onModalOpen = () => setVisible(true);
  const onModalClose = () => setVisible(false);

  /**
   * @author Shobhit
   * @since 20/09/2023
   * @description
   * Check booking against a phone number
   * Dispatch an action to welcome screen reducer
   * Takes two parameter phone number and country({callingCode, countryCode})
   */
  const handleBookingStatus = async () => {
    if (!phone) {
      Showtoast({text: 'Please Enter WhatsApp Number', toast, type: 'danger'});
      return;
    }

    if (!isConnected) {
      Alert.alert(
        'Network error',
        'You are not connected with internet. Please check your connection.',
        [{text: 'OK'}],
      );
      return;
    }

    if (!ipData) {
      dispatch(startFetchingIpData());
    }

    dispatch(fetchBookingStatusStart({phone, ipData}));
  };

  // Select different countries
  // Get country and calling code of selected country
  const handleSelectCountry = country => {
    let code = '';
    if (country.callingCode?.root && country.callingCode?.suffixes.length) {
      code = country.callingCode.root.concat(country.callingCode.suffixes[0]);
    }
    dispatch(
      setCountry({
        callingCode: code,
        countryCode: {cca2: country.countryCode.cca2},
      }),
    );
    onModalClose();
  };

  // Animation stuff
  const [slognText, setSlognText] = useState(localLang.tagline);
  const [animatedValues, setAnimatedValues] = useState([]);
  const animatedButtons = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSlognText(localLang.tagline);
  }, [currentLang]);

  useEffect(() => {
    let animations = [];
    slognText.split(' ').forEach((_, i) => {
      animations[i] = new Animated.Value(0);
    });

    setAnimatedValues(animations);
  }, [slognText]);

  useEffect(() => {
    if (!animatedValues.length) return;

    const animations = slognText.split(' ').map((_, i) => {
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

  const imageTranslateY = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  // UI Constants
  // Animated text
  const ANIMATED_TEXT = useMemo(() => {
    if (!animatedValues.length) return null;

    const TEXT = slognText.split(' ');
    return TEXT.map((word, index) => {
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
          {index <= TEXT.length ? ' ' : ''}
        </Animated.Text>
      );
    });
  }, [animatedValues]);

  const isTablet = deviceWidth > 540;
  let CONTAINER_STYLE = {};
  let CONTAINER_FLEX_STYLE = 2;

  if (isTablet) {
    CONTAINER_STYLE = {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    };

    CONTAINER_FLEX_STYLE = 1;
  }

  const btnContinueStyle = ({pressed}) => [
    styles.btnContinue,
    {opacity: pressed ? 0.8 : 1},
  ];

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        style={{
          flex: 1,
        }}
        source={require('../assets/images/background2.jpeg')}
        resizeMode="cover">
        {/* <LanguageSelection /> */}
        <View style={{}} className="py-4">
          <View style={[styles.container]}>
            <View style={{position: 'relative'}}>
              <Animated.Image
                source={IMAGES.LOGO}
                style={[
                  styles.animatedImage,
                  {
                    transform: [
                      {
                        translateY: imageTranslateY,
                      },
                    ],
                  },
                ]}
              />
              <View style={styles.animtedTextWrapper}>{ANIMATED_TEXT}</View>
            </View>
          </View>
        </View>
        {/* Footer */}
        <Animated.View
          className="flex-1"
          style={[
            styles.footer,
            {
              opacity: animatedButtons,
            },
          ]}>
          <View
            style={{
              elevation: 10,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
            }}
            className="py-6 bg-white px-3 relative">
            {/* <View className="absolute p-[2px] rounded-full bg-gray-400 top-1 left-[48%] w-[15%]"></View> */}

            <TextWrapper fs={17} styles={{marginLeft: 8, marginBottom: 6}}>
              Book Free Handwriting Class
            </TextWrapper>
            <View style={styles.row}>
              <Pressable style={styles.btnCountryCode} onPress={onModalOpen}>
                <TextWrapper>{country?.callingCode}</TextWrapper>
                <Icon name="chevron-down" size={20} color={COLORS.black} />
              </Pressable>
              <TextInput
                placeholder={
                  loginWithWhatsapp
                    ? 'Enter WhatsApp number'
                    : 'Enter your mobile number'
                }
                style={styles.input}
                selectionColor={COLORS.black}
                value={phone}
                onChangeText={handlePhone}
                inputMode="numeric"
                placeholderTextColor={'gray'}
                placeholderStyle={{fontWeight: 600}}
                maxLength={15}
              />
            </View>

            {loginWithWhatsapp && (
              <Pressable
                className="flex flex-row items-center mt-2 mb-2 justify-start px-3"
                onPress={() => setWhatsappConsent(!whatsappConsent)}>
                <View
                  className={`h-[18px] w-[18px] justify-center items-center rounded border  ${
                    whatsappConsent
                      ? 'border-[#76C8F2] bg-[#76C8F2]'
                      : 'border-gray-400 bg-white'
                  }`}>
                  {whatsappConsent && (
                    <MIcon name="check" color="white" size={16} />
                  )}
                </View>
                <Text
                  className="ml-2 text-[15px] text-gray-800"
                  style={{fontFamily: FONTS.primaryFont}}>
                  I agree to receive updates on{' '}
                  <MIcon name="whatsapp" color="green" size={20} /> WhatsApp
                </Text>
              </Pressable>
            )}
            {loginWithWhatsapp ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={btnContinueStyle}
                disabled={loading}
                onPress={() => whatsappConsent && handleBookingStatus()}
                className={`w-full items-center justify-center mt-3 rounded-full py-3 ${
                  whatsappConsent ? `bg-[${colorYlMain}]` : 'bg-blue-200'
                }`}>
                <TextWrapper
                  fs={18}
                  ff={FONTS.headingFont}
                  color={COLORS.white}>
                  LogIn
                </TextWrapper>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={btnContinueStyle}
                disabled={loading}
                onPress={handleBookingStatus}
                className={`w-full items-center justify-center mt-3 rounded-full py-3 bg-[${colorYlMain}]`}>
                <TextWrapper
                  fs={18}
                  ff={FONTS.headingFont}
                  color={COLORS.white}>
                  LogIn
                </TextWrapper>
              </TouchableOpacity>
            )}
            <View style={{alignItems: 'flex-end', paddingRight: 4}}>
              {loginWithWhatsapp ? (
                <Pressable
                  style={{paddingTop: 8}}
                  onPress={() => setLoginWithWhatsapp(false)}>
                  {/* onPress={() => navigation.navigate(SCREEN_NAMES.PHONELOGIN)}> */}
                  <TextWrapper
                    fs={16}
                    ff={FONTS.primaryFont}
                    color={textColors.textSecondary}
                    style={{
                      fontWeight: 400,
                      fontFamily: FONTS.primaryFont,
                      color: textColors.textSecondary,
                    }}>
                    Don't have WhatsApp?
                  </TextWrapper>
                </Pressable>
              ) : (
                <Pressable
                  style={{paddingTop: 8}}
                  onPress={() => setLoginWithWhatsapp(true)}>
                  {/* onPress={() => navigation.navigate(SCREEN_NAMES.PHONELOGIN)}> */}
                  <TextWrapper
                    fs={16}
                    ff={FONTS.primaryFont}
                    color={textColors.textSecondary}
                    style={{
                      fontWeight: 400,
                      fontFamily: FONTS.primaryFont,
                      color: textColors.textSecondary,
                    }}>
                    Have WhatsApp number?
                  </TextWrapper>
                </Pressable>
              )}
            </View>
            <Seperator text={'OR'} />
            <TouchableOpacity
              activeOpacity={0.8}
              style={btnContinueStyle}
              disabled={loading}
              onPress={() => navigation.navigate(SCREEN_NAMES.EMAIL_LOGIN)}
              className={`w-full items-center justify-center mt-1 rounded-full py-3 bg-[${colorYlMain}]`}>
              <TextWrapper fs={18} ff={FONTS.headingFont} color={COLORS.white}>
                Customer Log In
              </TextWrapper>
            </TouchableOpacity>

            {/* <View style={{alignItems: 'center', marginTop: 12}}>
              <Pressable
                style={({pressed}) => [
                  {
                    width: '100%',
                    paddingVertical: 8,
                    alignItems: 'center',
                    backgroundColor: pressed ? '#eaeaea' : 'transparent',
                  },
                ]}
                onPress={() => navigation.navigate(SCREEN_NAMES.EMAIL_LOGIN)}>
                <TextWrapper
                  fs={18}
                  ff={FONTS.primaryFont}
                  color={textColors.textSecondary}>
                  Existing customer login
                </TextWrapper>
              </Pressable>
            </View> */}
          </View>
        </Animated.View>
        <ModalComponent visible={loading}>
          <Center bg="rgba(0,0,0,0.25)">
            <Spinner />
          </Center>
        </ModalComponent>
        <CountryList
          visible={visible}
          onClose={onModalClose}
          onSelect={handleSelectCountry}
        />
      </ImageBackground>
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    position: 'relative',
  },
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
  animtedTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    // paddingBottom: 12,
    // position: 'absolute',
    // bottom: -GAP,
  },
  animatedText: {
    fontSize: 20,
    color: COLORS.black,
    fontFamily: FONTS.primaryFont,
    textTransform: 'capitalize',
    letterSpacing: 2.5,
    textAlign: 'center',
    lineHeight: 28,
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
    // backgroundColor: '#eee',
    // paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.pblue,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16.5,
    letterSpacing: 1.15,
    color: COLORS.black,
  },
  btnContinue: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.pblue,
    borderRadius: 54,
    marginTop: 8,
  },
  animatedImage: {
    alignSelf: 'center',
    height: 240,
    aspectRatio: 1 / 1,
    objectFit: 'contain',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  footerContent: {
    backgroundColor: COLORS.white,
    // padding: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // height: '100%',
    elevation: 8,
    height: 220,
  },
  btnCountryCode: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  btnConfirm: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
});
