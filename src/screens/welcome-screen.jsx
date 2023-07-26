import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  StatusBar,
  ToastAndroid,
  Image,
} from 'react-native';
import Spacer from '../components/spacer.component';
import Button from '../components/button.component';

import Input from '../components/input.component';

import {COLORS} from '../assets/theme/theme';

import {useSelector, useDispatch} from 'react-redux';

import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {startFetchBookingDetailsFromPhone} from '../store/join-demo/join-demo.reducer';

import TextWrapper from '../components/text-wrapper.component';
import Icon from '../components/icon.component';
import ModalComponent from '../components/modal.component';
import Center from '../components/center.component';
import Spinner from '../components/spinner.component';

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
    if (!phone) return;
    dispatch(startFetchBookingDetailsFromPhone(phone));
  };

  useEffect(() => {
    if (demoData) {
      setPopup(false);
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

  const onRequestClose = () => setPopup(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topContainer}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{paddingHorizontal: 16, alignItems: 'center'}}>
            <View style={{position: 'relative'}}>
              <Image
                source={require('../assets/images/YoungLabsLogo.png')}
                style={{
                  alignSelf: 'center',
                  width: 200,
                  height: 200,
                  objectFit: 'contain',
                }}
              />
            </View>
            <TextWrapper
              color={COLORS.black}
              fs={18}
              styles={{textAlign: 'center', textTransform: 'capitalize'}}>
              Helping parents raise capable, skillful & happy children
            </TextWrapper>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.pgreen}]}
          onPress={() => setPopup(true)}>
          <TextWrapper color={COLORS.white} fw="600">
            Join free booked class
          </TextWrapper>
        </Pressable>
        <ModalComponent
          animationType="slide"
          visible={popup}
          onRequestClose={onRequestClose}>
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
        </ModalComponent>
        <Spacer space={6} />
        <Pressable
          style={[styles.btnCtas, {backgroundColor: COLORS.orange}]}
          onPress={() => navigation.navigate('BookDemoForm')}>
          <TextWrapper color={COLORS.white} fw="600">
            Book a free class
          </TextWrapper>
        </Pressable>
      </View>
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
