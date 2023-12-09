import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../utils/constants/colors';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import {courseSelector} from '../store/course/course.selector';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {setPayment, startMakePayment} from '../store/payment/reducer';
import {authSelector} from '../store/auth/selector';
import {paymentSelector} from '../store/payment/selector';
import {MESSAGES} from '../utils/constants/messages';
import ModalComponent from '../components/modal.component';
import Icon from '../components/icon.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {resetCourseDetails} from '../store/course/course.reducer';

const {width: deviceWidth} = Dimensions.get('window');

const Payment = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentSelectedBatch) {
      const date = new Date(currentSelectedBatch.startDate._seconds * 1000);
      const dateAndTime = moment(date).format('MMMM Do [at] h:mm A');
      setDateTime(dateAndTime);
    }
  }, [currentSelectedBatch]);

  const {
    currentAgeGroup,
    currentSelectedBatch,
    levelText,
    currentLevel,
    price,
    strikeThroughPrice,
    courseDetails,
  } = useSelector(courseSelector);

  const {loading, payment, message} = useSelector(paymentSelector);

  console.log('paymentLoding', loading);
  console.log('payment', payment);

  const {bookingDetails} = useSelector(joinDemoSelector);
  const {ipData} = useSelector(bookDemoSelector);
  const {token} = useSelector(authSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (payment === MESSAGES.PAYMENT_SUCCESS) {
      setVisible(true);
    }
  }, [payment]);

  const handleCheckout = () => {
    if (!email) {
      setEmailErr('Enter your email address.');
      return;
    }

    dispatch(
      startMakePayment({
        price,
        strikeThroughPrice,
        currentSelectedBatch,
        levelText,
        ipData,
        bookingDetails,
        courseDetails,
        email,
        token,
      }),
    );

    setEmailErr('');
  };

  const onClose = () => setVisible(false);

  const goToHome = () => {
    dispatch(resetCourseDetails());
    dispatch(setPayment(''));
    navigation.navigate(SCREEN_NAMES.MAIN);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 12}}>
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700" styles={{textTransform: 'capitalize'}}>
            {bookingDetails.parentName}
          </TextWrapper>
          <Spacer space={2} />
          <TextWrapper>{bookingDetails?.phone}</TextWrapper>
        </View>
        <Spacer space={6} />
        <TextWrapper fs={20} fw="700">
          Course Details
        </TextWrapper>
        <Spacer space={4} />
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700">
            Name:{' '}
            <TextWrapper fs={18} fw="600">
              English Handwriting
            </TextWrapper>
          </TextWrapper>
          <Spacer space={6} />
          <TextWrapper fs={18} fw="700">
            Level:{' '}
            <TextWrapper fs={18} fw="600">
              {levelText}
            </TextWrapper>
          </TextWrapper>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon name="book-variant" size={26} color={COLORS.black} />
            <TextWrapper fs={18}>
              Total Classess:{' '}
              {currentLevel === 1 || currentLevel === 2 ? 12 : 24}
            </TextWrapper>
          </View>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon name="cake-variant" size={26} color={COLORS.black} />
            <TextWrapper fs={18}>For Ages: {currentAgeGroup}</TextWrapper>
          </View>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon name="calendar-month" size={26} color={COLORS.black} />
            <TextWrapper fs={18}>Start date: {dateTime}</TextWrapper>
          </View>
        </View>
        <Spacer space={4} />
        <View style={styles.card}>
          <TextInput
            placeholder="Enter email"
            style={styles.emailInput}
            textContentType="emailAddress"
            autoCorrect={false}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            value={email}
            onChangeText={e => setEmail(e)}
          />
          {emailErr && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {emailErr}
            </TextWrapper>
          )}
        </View>
      </ScrollView>
      <View style={{padding: 12}}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextWrapper fs={18}>Total</TextWrapper>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <TextWrapper
                fs={20}>{`${ipData?.currency.symbol}${price}`}</TextWrapper>
              <TextWrapper
                styles={{textDecorationLine: 'line-through'}}
                fs={
                  17
                }>{`${ipData?.currency.symbol}${strikeThroughPrice}`}</TextWrapper>
            </View>
          </View>
          <Spacer space={4} />
          <Pressable
            onPress={handleCheckout}
            style={({pressed}) => [
              styles.btnCheckout,
              {
                opacity: pressed ? 0.8 : 1,
                backgroundColor: loading ? '#3AAF1E' : COLORS.pgreen,
              },
            ]}
            disabled={loading}>
            <TextWrapper fs={18} fw="700" color={COLORS.white}>
              Checkout
            </TextWrapper>
          </Pressable>
        </View>
      </View>
      <ModalComponent
        visible={visible}
        onRequestClose={onClose}
        animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalOverlay}></Pressable>
          <View style={styles.modalContent}>
            <Pressable style={styles.btnClose} onPress={onClose}>
              <Icon name="close-outline" size={28} color={COLORS.black} />
            </Pressable>
            <MIcon
              name="check-circle"
              size={78}
              color={COLORS.pgreen}
              style={{alignSelf: 'center'}}
            />
            <Spacer space={4} />
            <TextWrapper fs={20} fw="700" styles={{textAlign: 'center'}}>
              Payment Successful
            </TextWrapper>
            <Spacer space={12} />
            <Pressable
              style={({pressed}) => [
                styles.btnCheckout,
                {opacity: pressed ? 0.8 : 1, backgroundColor: COLORS.pblue},
              ]}
              onPress={goToHome}>
              <TextWrapper fs={18} color={COLORS.white}>
                Continue
              </TextWrapper>
            </Pressable>
          </View>
          <Pressable style={styles.modalOverlay}></Pressable>
        </View>
      </ModalComponent>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    width: '100%',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  btnCheckout: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    width: deviceWidth * 0.8,
    maxWidth: 320,
    minHeight: 160,
    alignSelf: 'center',
    position: 'relative',
  },
  btnClose: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
});
