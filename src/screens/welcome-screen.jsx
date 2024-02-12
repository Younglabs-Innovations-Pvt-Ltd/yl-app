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
  setModalVisible,
  fetchBookingStatusStart,
  setCustomer,
} from '../store/welcome-screen/reducer';

import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {networkSelector} from '../store/network/selector';

import {i18nContext} from '../context/lang.context';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import Icon from '../components/icon.component';

const {width: deviceWidth} = Dimensions.get('window');
const IMAGE_WIDTH = deviceWidth * 0.7;
const IMAGE_HEIGHT = deviceWidth * 0.7;

const GAP = 54;

// Main Component
const DemoClassScreen = ({navigation}) => {
  const toast = useToast();
  const {colorYlMain} = useSelector(state => state.appTheme);

  const {localLang, currentLang} = i18nContext();

  const [phone, setPhone] = useState('');
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const {ipData} = useSelector(bookDemoSelector);
  const {country, loading, customer} = useSelector(welcomeScreenSelector);

  // Setting background color and style of Statusbar
  useEffect(() => {
    StatusBar.setBackgroundColor(COLORS.pblue);
    StatusBar.setBarStyle('light-content');
  }, []);

  // show message to customer to login with right credentials (email and password)
  useEffect(() => {
    if (customer === 'yes') {
      Showtoast({
        text: 'Login with right credentials (email, password)',
        toast,
        type: 'danger',
      });

      dispatch(setCustomer(''));
    }
  }, [customer]);

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
      Showtoast({text: 'Please Enter Whatsapp Number', toast, type: 'danger'});
    }
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
          className=""
          style={[
            styles.footer,
            {
              opacity: animatedButtons,
            },
          ]}>
          <View
            style={{elevation: 10}}
            className="py-6 bg-white px-3 rounded-2xl relative">
            {/* <View className="absolute p-[2px] rounded-full bg-gray-400 top-1 left-[48%] w-[15%]"></View> */}

            {/* <TextWrapper fs={18} styles={{marginLeft: 8, marginBottom: 8}}>
              Book Free Handwriting Class
            </TextWrapper> */}
            <View style={styles.row}>
              <Pressable style={styles.btnCountryCode} onPress={onModalOpen}>
                <TextWrapper>{country?.callingCode}</TextWrapper>
                <Icon name="chevron-down" size={20} color={COLORS.black} />
              </Pressable>
              <TextInput
                placeholder="Enter Whatsapp number"
                style={styles.input}
                selectionColor={COLORS.black}
                value={phone}
                onChangeText={handlePhone}
                inputMode="numeric"
                placeholderTextColor={'gray'}
                maxLength={15}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={btnContinueStyle}
              disabled={loading}
              onPress={handleBookingStatus}
              className={`w-full items-center justify-center mt-3 rounded-full py-3 bg-[${colorYlMain}]`}>
              <TextWrapper fs={18} ff={FONTS.headingFont} color={COLORS.white}>
                Log in
              </TextWrapper>
            </TouchableOpacity>

            <View style={{alignItems: 'center', marginTop: 28}}>
              <Pressable
                style={{paddingVertical: 4}}
                onPress={() => navigation.navigate(SCREEN_NAMES.EMAIL_LOGIN)}>
                <TextWrapper
                  fs={16}
                  ff={FONTS.primaryFont}
                  className="text-gray-600">
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
    flex: 1,
    paddingHorizontal: 16,
    position: 'relative',
    marginTop: deviceWidth * 0.2,
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
