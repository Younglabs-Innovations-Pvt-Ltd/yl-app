import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  StatusBar,
  ToastAndroid,
  Dimensions,
  Animated,
} from 'react-native';
import Spacer from '../components/spacer.component';
import Button from '../components/button.component';

import Input from '../components/input.component';

import {COLORS, FONTS} from '../assets/theme/theme';

import {useSelector, useDispatch} from 'react-redux';

import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {startFetchBookingDetailsFromPhone} from '../store/join-demo/join-demo.reducer';

import TextWrapper from '../components/text-wrapper.component';
import Icon from '../components/icon.component';
import ModalComponent from '../components/modal.component';
import Center from '../components/center.component';
import Spinner from '../components/spinner.component';

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.7;
const IMAGE_HEIGHT = width * 0.7;

// Main Component
const DemoClassScreen = ({navigation}) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();
  const {demoData, loading} = useSelector(joinDemoSelector);

  useEffect(() => {
    StatusBar.setHidden(true);
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleBookingStatus = () => {
    if (!phone) return;
    dispatch(startFetchBookingDetailsFromPhone(phone));
  };

  useEffect(() => {
    if (demoData) {
      setShowBottomSheet(false);
      if (demoData?.message === 'Booking not found') {
        ToastAndroid.showWithGravity(
          'Wrong Number',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        return;
      }

      navigation.replace('Main');
    }
  }, [demoData]);

  const closeBottomSheet = () => setShowBottomSheet(false);
  const openBottomSheet = () => setShowBottomSheet(true);

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
        duration: 800,
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
      delay: 3500,
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
      <View style={styles.topContainer}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            position: 'relative',
            justifyContent: 'center',
            paddingTop: 20,
          }}>
          <View style={{}}>
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
          </View>

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
      <Animated.View
        style={[styles.bottomContainer, {opacity: animatedButtons}]}>
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.pgreen}]}
          onPress={openBottomSheet}>
          <TextWrapper fs={18} color={COLORS.white} fw="600">
            Join free booked class
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
                    // borderBottomWidth: 1,
                    // borderBottomColor: '#eaeaea',
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
                  <Input
                    placeholder="Enter phone"
                    inputMode="numeric"
                    value={phone}
                    onChangeText={e => setPhone(e)}
                  />
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
        <Spacer space={6} />
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.orange}]}
          onPress={() => navigation.navigate('BookDemoForm')}>
          <TextWrapper fs={18} color={COLORS.white} fw="600">
            Book a free handwriting class
          </TextWrapper>
        </Pressable>
      </Animated.View>
      <ModalComponent visible={loading}>
        <Center>
          <Spinner />
        </Center>
      </ModalComponent>
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 2,
  },
  bottomContainer: {
    flex: 0.5,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  btnCtas: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
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
});
