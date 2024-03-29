import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Animated,
  TextInput,
  StatusBar,
  ImageBackground,
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
  setModalVisible,
  fetchBookingStatusStart,
} from '../store/welcome-screen/reducer';

import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {networkSelector} from '../store/network/selector';

import {phoneNumberLength} from '../utils/phoneNumbersLength';
import {i18nContext} from '../context/lang.context';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

const {width: deviceWidth} = Dimensions.get('window');
const IMAGE_WIDTH = deviceWidth * 0.7;
const IMAGE_HEIGHT = deviceWidth * 0.7;

const GAP = 54;

// Main Component
const DemoClassScreen = ({navigation}) => {
  const {localLang, currentLang} = i18nContext();

  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();

  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);
  const {ipData} = useSelector(bookDemoSelector);
  const {country, modalVisible, loading, message} = useSelector(
    welcomeScreenSelector,
  );

  // Setting background color and style of Statusbar
  useEffect(() => {
    StatusBar.setBackgroundColor(COLORS.pblue);
    StatusBar.setBarStyle('light-content');
  }, []);

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
    dispatch(fetchBookingStatusStart({phone}));
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

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/images/background2.jpeg')}
        resizeMode="cover">
        {/* <LanguageSelection /> */}
        <View style={{flex: 1}}>
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
          style={[
            styles.footer,
            {
              opacity: animatedButtons,
            },
          ]}>
          <View style={styles.footerContent}>
            {/* <TextWrapper fs={18} styles={{marginLeft: 8, marginBottom: 8}}>
              Book Free Handwriting Class
            </TextWrapper> */}
            <View style={styles.row}>
              <Pressable style={styles.btnCountryCode}>
                <TextWrapper>{'+91'}</TextWrapper>
              </Pressable>
              <TextInput
                placeholder="Enter WhatsApp number"
                style={styles.input}
                selectionColor={COLORS.black}
                value={phone}
                onChangeText={handlePhone}
                inputMode="numeric"
                placeholderTextColor={'gray'}
                maxLength={maxPhoneLength}
              />
            </View>
            <Pressable
              style={btnContinueStyle}
              disabled={loading}
              onPress={handleBookingStatus}>
              <TextWrapper fs={18} fw="800" color={COLORS.white}>
                Log in
              </TextWrapper>
            </Pressable>
            <View style={{alignItems: 'flex-end', marginTop: 8}}>
              <Pressable
                style={{paddingVertical: 4}}
                onPress={() => navigation.navigate(SCREEN_NAMES.SIGNUP)}>
                <TextWrapper fs={16}>Don't have WhatsApp</TextWrapper>
              </Pressable>
              <Pressable
                style={{paddingVertical: 4}}
                onPress={() => navigation.navigate(SCREEN_NAMES.EMAIL_LOGIN)}>
                <TextWrapper fs={16}>
                  Existing user? Login with Email
                </TextWrapper>
              </Pressable>
            </View>
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
      </ImageBackground>
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: FONTS.gelasio_semibold,
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
    flex: 1,
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
