import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  StatusBar,
  Animated,
  Easing,
  Modal,
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

// Main Component
const DemoClassScreen = ({navigation}) => {
  const [popup, setPopup] = useState(false);
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();
  const {demoData, loading} = useSelector(joinDemoSelector);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const handleBookingStatus = () => {
    console.log('hit');
    if (!phone) return;
    dispatch(startFetchBookingDetailsFromPhone(phone));
  };

  useEffect(() => {
    if (demoData) {
      setPopup(false);
      navigation.replace('Main');
    }
  }, [demoData]);

  const rotatedLogo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotatedLogo, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topContainer}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{paddingHorizontal: 16, alignItems: 'center'}}>
            <View style={{position: 'relative'}}>
              <TextWrapper
                color={COLORS.white}
                styles={{letterSpacing: 2, textAlign: 'center'}}
                fs={76}
                ff={FONTS.bigShoulders_semibold}>
                Younglabs
              </TextWrapper>
              <Animated.Image
                source={require('../assets/images/spinner.png')}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                  position: 'absolute',
                  left: -10,
                  top: -24,
                  transform: [
                    {
                      rotate: rotatedLogo.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
              />
            </View>
            <Spacer space={4} />
            <TextWrapper
              color={COLORS.white}
              fs={18}
              styles={{textAlign: 'center', textTransform: 'capitalize'}}>
              Helping parents raise capable, skillful & happy children
            </TextWrapper>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.white}]}
          onPress={() => setPopup(true)}>
          <TextWrapper color={COLORS.black} fw="600">
            Join free booked class
          </TextWrapper>
        </Pressable>
        <Modal transparent={true} animationType="slide" visible={popup}>
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
                  paddingHorizontal: 12,
                  paddingTop: 12,
                  paddingBottom: 20,
                }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    alignItems: 'flex-end',
                  }}>
                  <Pressable onPress={() => setPopup(false)}>
                    <Icon name="close-sharp" size={28} color={COLORS.black} />
                  </Pressable>
                </View>
                <TextWrapper>
                  Enter your mobile number to get free class details
                </TextWrapper>
                <Input
                  placeholder="Enter phone"
                  inputMode="numeric"
                  value={phone}
                  onChangeText={e => setPhone(e)}
                />
                <Spacer space={12} />
                <Button
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
        </Modal>
        <Spacer space={6} />
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.orange}]}
          onPress={() => navigation.navigate('BookDemoForm')}>
          <TextWrapper color={COLORS.white} fw="600">
            Book a free class
          </TextWrapper>
        </Pressable>
      </View>
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#12452C',
  },
  topContainer: {
    flex: 2,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  btnCtas: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});
