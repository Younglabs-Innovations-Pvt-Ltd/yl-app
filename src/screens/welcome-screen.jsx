import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Animated,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Spacer from '../components/spacer.component';

import {FONTS} from '../utils/constants/fonts';
import {COLORS} from '../utils/constants/colors';
import {IMAGES} from '../utils/constants/images';

import TextWrapper from '../components/text-wrapper.component';
import ModalComponent from '../components/modal.component';
import Center from '../components/center.component';
import Spinner from '../components/spinner.component';
import CountryList from '../components/country-list.component';

import {useDispatch, useSelector} from 'react-redux';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import {
  setCountry,
  setModalVisible,
  fetchBookingStatusStart,
} from '../store/welcome-screen/reducer';

import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {networkSelector} from '../store/network/selector';

import {phoneNumberLength} from '../utils/phoneNumbersLength';
import {i18nContext} from '../context/lang.context';
import {resetCurrentNetworkState} from '../store/network/reducer';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import {phoneAuthStart, setAuthToken, verifyCode} from '../store/auth/reducer';
import {authSelector} from '../store/auth/selector';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import Icon from '../components/icon.component';

const {width: deviceWidth} = Dimensions.get('window');
const IMAGE_WIDTH = deviceWidth * 0.7;
const IMAGE_HEIGHT = deviceWidth * 0.7;

// Main Component
const DemoClassScreen = ({navigation}) => {
  const {localLang, currentLang} = i18nContext();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const {
    confirm,
    message: authMsg,
    loading: authLoading,
    verificationErrorMessage,
    verificationLoading,
  } = useSelector(authSelector);

  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);
  const {ipData} = useSelector(bookDemoSelector);
  const {country, modalVisible} = useSelector(welcomeScreenSelector);

  // Setting background color and style of Statusbar
  useEffect(() => {
    StatusBar.setBackgroundColor(COLORS.pblue);
    StatusBar.setBarStyle('light-content');
  }, []);

  /**
   * @author Shobhit
   * @since 03/10/2023
   * @description  Checking for internet connected or not
   * If connected and ipData is not null then fetch ipData and update state silently
   */
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     if (state.isConnected && !ipData) {
  //       dispatch(startFetchingIpData());
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [ipData]);

  /**
   * @author Shobhit
   * @since 20/09/2023
   * @description
   * Calling ip geolocation api to fetch ip data(like country calling code, country code and timezone)
   * Check if ipData is available
   * If not only then fetch (to avoid make api calls on every render)
   */
  // useEffect(() => {
  //   if (!ipData) {
  //     dispatch(startFetchingIpData());
  //   }
  // }, [ipData]);

  /**
   * @author Shobhit
   * @since 20/09/2023
   * @description
   * Setting calling code and country code to country state
   * To show default calling code in input
   */
  // useEffect(() => {
  //   if (ipData) {
  //     dispatch(
  //       setCountry({
  //         callingCode: ipData.calling_code,
  //         countryCode: {cca2: ipData.country_code2},
  //       }),
  //     );
  //   }
  // }, [ipData]);

  useEffect(() => {
    if (confirm) {
      setVisible(true);
    }
  }, [confirm]);

  const handlePhone = e => {
    const phoneRegex = /^[0-9]*$/; // Check for only number enters in input
    if (phoneRegex.test(e)) {
      setPhone(e);
    }
  };

  /**
   * @author Shobhit
   * @since 20/09/2023
   * @description
   * Check booking against a phone number
   * Dispatch an action to welcome screen reducer
   * Takes two parameter phone number and country({callingCode, countryCode})
   */
  const handleBookingStatus = async () => {
    dispatch(fetchBookingStatusStart({phone, country}));
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
    dispatch(setModalVisible(false));
  };

  const onCloseBottomSheet = () => dispatch(setModalVisible(false));
  const showCountryList = () => dispatch(setModalVisible(true));

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

  // Check for max length of a phone number according country
  const maxPhoneLength = useMemo(() => {
    if (!country?.countryCode) {
      return 15;
    }
    return phoneNumberLength[country.countryCode.cca2];
  }, [country]);

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

  // if (!isConnected) {
  //   Alert.alert(
  //     '',
  //     'We cannot continue due to network problem. Please check your network connection.',
  //     [
  //       {
  //         text: 'Refresh',
  //         onPress: () => {
  //           dispatch(resetCurrentNetworkState());
  //           dispatch(alertAction);
  //         },
  //       },
  //       {
  //         text: 'CANCEL',
  //         onPress: () => {
  //           dispatch(resetCurrentNetworkState());
  //         },
  //       },
  //     ],
  //   );
  // }

  // Handle the button press
  async function signInWithPhoneNumber() {
    dispatch(phoneAuthStart({phone, country}));
  }

  function confirmCode() {
    dispatch(verifyCode({confirm, verificationCode: code}));
  }

  async function onAuthStateChanged(user) {
    if (user) {
      try {
        setVisible(false);
        setLoading(true);
        const tokenResult = await auth().currentUser.getIdTokenResult();
        dispatch(setAuthToken(tokenResult.token));
        setLoading(false);
        navigation.replace(SCREEN_NAMES.MAIN);
      } catch (error) {
        setLoading(false);
        console.error('Error getting ID token:', error);
      }
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* <LanguageSelection /> */}
      <View style={{flex: CONTAINER_FLEX_STYLE}}>
        <View style={[styles.container, CONTAINER_STYLE]}>
          <View>
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
        style={[
          styles.footer,
          {
            opacity: animatedButtons,
          },
        ]}>
        <View style={styles.footerContent}>
          <View style={styles.row}>
            <Pressable style={styles.btnCountryCode}>
              <TextWrapper>{'+91'}</TextWrapper>
            </Pressable>
            <TextInput
              placeholder="Enter phone number"
              style={styles.input}
              selectionColor={COLORS.black}
              value={phone}
              onChangeText={handlePhone}
              inputMode="numeric"
              placeholderTextColor={'gray'}
              maxLength={maxPhoneLength}
            />
          </View>
          {/* {message && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {message}
            </TextWrapper>
          )} */}
          {!authMsg && <Spacer space={6} />}
          {authMsg && (
            <TextWrapper
              fs={14}
              color={COLORS.pred}
              styles={{marginVertical: 4, marginLeft: 8}}>
              {authMsg}
            </TextWrapper>
          )}
          <Pressable
            style={btnContinueStyle}
            disabled={authLoading}
            onPress={handleBookingStatus}>
            <TextWrapper fs={18} fw="800" color={COLORS.white}>
              Continue
            </TextWrapper>
            {authLoading && (
              <ActivityIndicator
                size={'small'}
                color={COLORS.white}
                style={{marginLeft: 4}}
              />
            )}
          </Pressable>
        </View>
      </Animated.View>
      <ModalComponent visible={loading}>
        <Center bg="rgba(0,0,0,0.25)">
          <Spinner />
        </Center>
      </ModalComponent>
      <CountryList
        visible={modalVisible}
        onClose={onCloseBottomSheet}
        onSelect={handleSelectCountry}
      />
      <ModalComponent
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.25)',
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                paddingBottom: 16,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                width: '100%',
              }}>
              <Pressable style={{padding: 4}} onPress={() => setVisible(false)}>
                <Icon name="close-outline" size={24} color={COLORS.black} />
              </Pressable>
            </View>
            <TextInput
              placeholder="Enter otp"
              style={{
                padding: 8,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: 'gray',
                borderRadius: 4,
                color: COLORS.black,
                fontSize: 18,
              }}
              selectionColor={COLORS.black}
              value={code}
              onChangeText={e => setCode(e)}
              inputMode="numeric"
              placeholderTextColor={'gray'}
            />
            {verificationErrorMessage && (
              <TextWrapper
                fs={14}
                color={COLORS.pred}
                styles={{marginBottom: 4}}>
                {verificationErrorMessage}
              </TextWrapper>
            )}
            <Pressable
              style={({pressed}) => [
                styles.btnConfirm,
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: !code ? '#f4f4f4' : '#F1EEE9',
                },
              ]}
              disabled={!code}
              onPress={confirmCode}>
              <TextWrapper fs={18}>Submit</TextWrapper>
              {verificationLoading && (
                <ActivityIndicator
                  size={'small'}
                  color={COLORS.black}
                  style={{marginLeft: 4}}
                />
              )}
            </Pressable>
          </View>
        </View>
      </ModalComponent>
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
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
    paddingBottom: 12,
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
    flexDirection: 'row',
    backgroundColor: COLORS.pblue,
    borderRadius: 54,
  },
  animatedImage: {
    alignSelf: 'center',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    maxWidth: 240,
    maxHeight: 240,
    objectFit: 'contain',
  },
  footer: {
    flex: 1,
    maxHeight: 180,
    justifyContent: 'flex-start',
  },
  footerContent: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '100%',
    justifyContent: 'center',
    elevation: 8,
  },
  btnCountryCode: {
    display: 'flex',
    justifyContent: 'center',
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
