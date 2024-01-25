import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
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
import {setPaymentMessage, startMakePayment} from '../store/payment/reducer';
import {paymentSelector} from '../store/payment/selector';
import {MESSAGES} from '../utils/constants/messages';
import ModalComponent from '../components/modal.component';
import Icon from '../components/icon.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {resetCourseDetails} from '../store/course/course.reducer';
import {getOfferCode} from '../utils/api/yl.api';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/constants/local-keys';
import {FONTS} from '../utils/constants/fonts';
import ConfettiCannon from 'react-native-confetti-cannon';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '54129267828-73o9bu1af3djrmh0e9krbk59s1g47rsp.apps.googleusercontent.com',
});

const {width: deviceWidth} = Dimensions.get('window');

const Payment = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [offerCodes, setOfferCodes] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [amount, setAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [visibleCongratulations, setVisibleCongratulations] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

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
  const confettiRef = useRef();
  const cannonWrapperRef = useRef();

  const {bookingDetails} = useSelector(joinDemoSelector);
  const {ipData} = useSelector(bookDemoSelector);

  const dispatch = useDispatch();

  // Set current screen name

  useEffect(() => {
    setAmount(price);
  }, [price]);

  useEffect(() => {
    const fetchOfferCodes = async () => {
      if (bookingDetails) {
        const response = await getOfferCode({phone: bookingDetails.phone});
        const codes = await response.json();
        setOfferCodes(codes?.offerCodes);
      }
    };

    fetchOfferCodes();
  }, [bookingDetails]);

  useEffect(() => {
    if (payment === MESSAGES.PAYMENT_SUCCESS) {
      setVisible(true);
    }
  }, [payment]);

  const handleCheckout = async () => {
    if (!email) {
      setEmailErr('Enter your email address.');
      return;
    }

    const currentUser = auth().currentUser;

    if (!currentUser) {
      setAuthVisible(true);
      return;
    }

    const body = {
      price,
      strikeThroughPrice,
      currentSelectedBatch,
      levelText,
      ipData,
      bookingDetails,
      courseDetails,
      email,
    };

    if (selectedCoupon) {
      body.offerCode = selectedCoupon.offerCode;
    }

    if (couponApplied) {
      body.discountedPrice = amount;
    }

    dispatch(startMakePayment(body));

    setEmailErr('');
  };

  const applyCouponCode = () => {
    if (!couponCode || couponApplied) {
      return;
    }
    console.log('hit');

    const matchCoupons = offerCodes?.find(item => {
      return item.offerCode === couponCode;
    });

    console.log('matchCoupons', matchCoupons);

    if (matchCoupons) {
      setSelectedCoupon(matchCoupons);
      console.log('item matched');

      if (matchCoupons?.discountType === 'flat') {
        console.log('flat coupon');
        setAmount(price - matchCoupons?.discountValue);
        setCouponApplied(true);
      } else if (matchCoupons?.discountType === 'percentage') {
        console.log('percentage coupon');
        setAmount(
          parseInt(price - price * (matchCoupons?.discountValue / 100)),
        ),
          setCouponApplied(true);
      }

      setCouponMsg('');
      // if (confettiRef.current) {
      //   confettiRef.current.start();
      //   setFadeOut(true);
      //   setVisibleCongratulations(true);
      // }
    } else {
      setSelectedCoupon(null);
      setCouponMsg('Coupon Not Found');
      console.log('item not found');
    }
  };

  useEffect(() => {
    let timeout;
    if (visibleCongratulations) {
      timeout = setTimeout(() => {
        setVisibleCongratulations(false);
      }, 1800);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [visibleCongratulations]);

  const clearAppliedCode = () => {
    setAmount(price);
    setCouponApplied(false);
    setSelectedCoupon(null);
    setCouponCode('');
  };

  // console.log('selectedCoupon', selectedCoupon);

  const onClose = () => setVisible(false);

  const goToHome = () => {
    dispatch(resetCourseDetails());
    dispatch(setPaymentMessage(MESSAGES.PAYMENT_SUCCESS));
    navigation.navigate(SCREEN_NAMES.MAIN);
  };

  const applyDefaultCode = () => {
    // if (cannonWrapperRef.current) {
    //   // console.log('cannonWrapperRef.current', cannonWrapperRef.current);
    //   cannonWrapperRef.current.setNativeProps({
    //     style: {
    //       opacity: 1,
    //     },
    //   });
    // }
    setAmount(parseInt(price - price * (10 / 100)));
    setCouponApplied(true);
    setCouponCode('YLAPP10');
    setSelectedCoupon({
      discountType: 'percentage',
      discountValue: 10,
      offerCode: 'YLAPP10',
      offerName: 'App Download',
      validAbove: 1500,
    });
    // if (confettiRef.current) {
    //   confettiRef.current.start();
    //   setFadeOut(true);
    //   setVisibleCongratulations(true);
    // }
  };

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
      setAuthVisible(false);
    } catch (error) {
      console.log('GoogleAuthenticationError', error);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 12}}>
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700" styles={{textTransform: 'capitalize'}}>
            {bookingDetails?.parentName}
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
            selectionColor={COLORS.black}
            placeholderTextColor={'gray'}
          />
          {emailErr && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {emailErr}
            </TextWrapper>
          )}
        </View>
        <Spacer space={4} />
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextWrapper
              fw="700"
              fs={14}
              color={COLORS.pgreen}
              styles={{textAlign: 'left', opacity: couponApplied ? 1 : 0}}>
              Applied
            </TextWrapper>
            <Pressable
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                alignSelf: 'flex-end',
                backgroundColor: '#eee',
                borderRadius: 4,
                marginBottom: 8,
              }}
              onPress={couponApplied ? clearAppliedCode : applyDefaultCode}>
              <TextWrapper ff={FONTS.signika_semiBold}>
                Apply Coupon YLAPP10
              </TextWrapper>
            </Pressable>
          </View>
          <View>
            <TextWrapper styles={{marginBottom: 6}}>
              Have another code?
            </TextWrapper>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
              }}>
              <TextInput
                placeholder="Enter here"
                style={[styles.emailInput, {flex: 1}]}
                autoCorrect={false}
                autoCapitalize="characters"
                keyboardType="default"
                value={couponCode}
                onChangeText={e => setCouponCode(e)}
                selectionColor={COLORS.black}
                placeholderTextColor={'gray'}
              />
              <Pressable
                style={{
                  padding: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 4,
                  borderColor: 'gray',
                }}
                onPress={couponApplied ? clearAppliedCode : applyCouponCode}>
                <TextWrapper fs={18}>
                  {couponApplied ? 'Clear' : 'Apply'}
                </TextWrapper>
              </Pressable>
            </View>
          </View>
          {couponMsg && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {couponMsg}
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
                fs={20}>{`${ipData?.currency.symbol}${amount}`}</TextWrapper>
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
                backgroundColor: COLORS.pblue,
              },
            ]}
            disabled={loading}>
            <TextWrapper fs={18} fw="700" color={COLORS.white}>
              Checkout
            </TextWrapper>
            {loading && (
              <ActivityIndicator
                size={'small'}
                color={COLORS.white}
                style={{marginLeft: 4}}
              />
            )}
          </Pressable>
        </View>
        <View
          style={{
            borderWidth: 2,
            position: 'absolute',
            left: 0,
            bottom: 0,
            opacity: 0,
          }}
          ref={cannonWrapperRef}>
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{x: 0, y: 0}}
            autoStart={false}
            fadeOut={fadeOut}
            fallSpeed={1800}
            explosionSpeed={450}
          />
        </View>
      </View>
      <ModalComponent visible={visibleCongratulations} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}>
          <TextWrapper
            fs={36}
            ff={FONTS.signika_semiBold}
            color={COLORS.white}
            styles={{textAlign: 'center'}}>
            Congratulations
          </TextWrapper>
        </View>
      </ModalComponent>
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
      <ModalComponent visible={authVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.15)',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center', paddingHorizontal: 16}}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 24,
                backgroundColor: COLORS.white,
                borderRadius: 8,
                elevation: 4,
                width: 300,
              }}>
              <Icon
                name="close-outline"
                color="#434a52"
                size={28}
                style={{
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
                onPress={() => setAuthVisible(false)}
              />
              <TextWrapper
                fs={22}
                ff={FONTS.signika_semiBold}
                styles={{textAlign: 'center', marginTop: 6}}>
                Please login to continue
              </TextWrapper>
              <Spacer space={10} />
              <Pressable style={styles.btnLogin} onPress={onGoogleButtonPress}>
                <Icon name="logo-google" size={24} color="#434a52" />
                <TextWrapper
                  ff={FONTS.signika_semiBold}
                  fs={18}
                  color="#434a52"
                  styles={{marginLeft: 4}}>
                  Login with Google
                </TextWrapper>
              </Pressable>
            </View>
          </View>
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
    color: COLORS.black,
  },
  btnCheckout: {
    padding: 12,
    flexDirection: 'row',
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
  btnLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 6,
  },
});
