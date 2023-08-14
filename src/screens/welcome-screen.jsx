import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import Spacer from '../components/spacer.component';
import Button from '../components/button.component';

import {COLORS, FONTS} from '../assets/theme/theme';

import TextWrapper from '../components/text-wrapper.component';
import Icon from '../components/icon.component';
import ModalComponent from '../components/modal.component';
import Center from '../components/center.component';
import Spinner from '../components/spinner.component';
import {fetchBookingDetailsFromPhone} from '../utils/api/yl.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Seperator from '../components/seperator.component';
import CountryList from '../components/country-list.component';

import {useDispatch, useSelector} from 'react-redux';
import {
  startFetchingIpData,
  setIpDataLoadingState,
} from '../store/book-demo/book-demo.reducer';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {isValidNumber} from '../utils/isValidNumber';

const {width: deviceWidth} = Dimensions.get('window');
const IMAGE_WIDTH = deviceWidth * 0.7;
const IMAGE_HEIGHT = deviceWidth * 0.7;

// Main Component
const DemoClassScreen = ({navigation}) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState({callingCode: ''});

  const isTablet = deviceWidth > 540;

  const dispatch = useDispatch();

  const {
    ipData,
    loading: {ipDataLoading},
  } = useSelector(bookDemoSelector);

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

  const handleBookingStatus = async () => {
    if (!phone) {
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
        setErrorMsg('Details not found. Please check your phone number');
        setLoading(false);
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
      console.log(error);
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

  const closeBottomSheet = () => {
    setShowBottomSheet(false);
    setPhone('');
    if (errorMsg) setErrorMsg('');
  };
  const openBottomSheet = () => setShowBottomSheet(true);

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
          styles.bottomContainer,
          {
            opacity: animatedButtons,
            flex: isTablet ? 0.8 : 0.7,
            justifyContent: 'flex-start',
            paddingTop: isTablet ? 20 : 0,
          },
        ]}>
        <TextWrapper
          fs={14}
          style={{
            marginBottom: 4,
            marginLeft: 4,
            color: COLORS.black,
            textAlign: 'center',
          }}>
          Already have a booking?
        </TextWrapper>
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.pgreen}]}
          onPress={openBottomSheet}>
          <TextWrapper
            fs={18}
            color={COLORS.white}
            fw="600"
            styles={{textTransform: 'capitalize'}}>
            Enter phone to continue
          </TextWrapper>
        </Pressable>
        {/* Bottom sheet modal */}
        <ModalComponent
          animationType="slide"
          visible={showBottomSheet}
          onRequestClose={closeBottomSheet}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  paddingBottom: 20,
                  borderTopWidth: 1,
                  borderTopColor: '#eaeaea',
                }}>
                <View
                  style={{
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                  }}>
                  <TextWrapper fs={18} fw="600">
                    Join class
                  </TextWrapper>
                  <Pressable
                    style={styles.btnRoundedClose}
                    onPress={closeBottomSheet}>
                    <Icon name="close-outline" size={22} color={COLORS.black} />
                  </Pressable>
                </View>
                <View style={{paddingHorizontal: 16}}>
                  <View style={styles.row}>
                    <Pressable
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingHorizontal: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.black,
                      }}
                      onPress={() => setVisible(p => !p)}>
                      <TextWrapper>{country.callingCode}</TextWrapper>
                    </Pressable>
                    <TextInput
                      placeholder="Enter your phone number"
                      style={styles.input}
                      selectionColor={COLORS.black}
                      value={phone}
                      onChangeText={e => setPhone(e)}
                      inputMode="numeric"
                      placeholderTextColor={'gray'}
                    />
                  </View>
                  {/* <Input
                    placeholder="Enter phone"
                    inputMode="numeric"
                    value={phone}
                    onChangeText={e => setPhone(e)}
                  /> */}
                  {errorMsg && (
                    <TextWrapper fs={14} color={COLORS.pred}>
                      {errorMsg}
                    </TextWrapper>
                  )}
                  <Spacer space={12} />
                  <Button
                    textSize={18}
                    bg={COLORS.pgreen}
                    textColor={COLORS.white}
                    rounded={4}
                    onPress={handleBookingStatus}
                    loading={loading}>
                    Submit
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </ModalComponent>
        <Seperator text="or" />
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.orange}]}
          onPress={() => navigation.navigate('BookDemoForm')}>
          <TextWrapper
            fs={18}
            color={COLORS.white}
            fw="600"
            styles={{textTransform: 'capitalize'}}>
            Book a free handwriting class
          </TextWrapper>
        </Pressable>
      </Animated.View>
      <ModalComponent visible={loading}>
        <Center>
          <Spinner />
        </Center>
      </ModalComponent>
      <CountryList
        visible={visible}
        onClose={onCloseBottomSheet}
        onSelect={handleSelectCountry}
      />
      {/* <ModalComponent
        visible={ipDataLoading}
        onRequestClose={() => setIpDataLoadingState(false)}>
        <Center>
          <Spinner />
        </Center>
      </ModalComponent> */}
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  topContainer: {
    flex: 2,
  },
  bottomContainer: {
    paddingBottom: 24,
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
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#000',
    fontSize: 18,
    letterSpacing: 1.15,
    borderBottomWidth: 1,
    color: COLORS.black,
  },
});
