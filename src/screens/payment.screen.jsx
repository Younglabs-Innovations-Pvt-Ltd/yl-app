import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../utils/constants/colors';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import {courseSelector} from '../store/course/course.selector';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {
  makeSoloPayment,
  setMessage,
  setPaymentMessage,
  startMakePayment,
} from '../store/payment/reducer';
import {paymentSelector} from '../store/payment/selector';
import {MESSAGES} from '../utils/constants/messages';
import ModalComponent from '../components/modal.component';
import Icon from '../components/icon.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {resetCourseDetails} from '../store/course/course.reducer';
import {addParentNameToLead, getOfferCode} from '../utils/api/yl.api';
import {FONTS} from '../utils/constants/fonts';
import ConfettiCannon from 'react-native-confetti-cannon';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authSelector} from '../store/auth/selector';
import {BASE_URL} from '@env';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {userSelector} from '../store/user/selector';
import {AddChildModule} from '../components/MainScreenComponents/AddChildModule';
import Snackbar from 'react-native-snackbar';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {setUser} from '../store/auth/reducer';

GoogleSignin.configure({
  webClientId:
    '54129267828-73o9bu1af3djrmh0e9krbk59s1g47rsp.apps.googleusercontent.com',
});

const {width: deviceWidth} = Dimensions.get('window');

const Payment = ({navigation, route}) => {
  const {paymentBatchType} = route.params;
  const {paymentMethod} = route.params;
  const {classesSold} = route.params;
  const [emailErr, setEmailErr] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [offerCodes, setOfferCodes] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [amount, setAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [visibleCongratulations, setVisibleCongratulations] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  // referral and coupon handle
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const [creditsValueApplied, setCreditsValueApplied] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDisCount] = useState(0);
  const [selectedReferralCode, setSelectedReferralCode] = useState(null);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [dropdownData, setDropDownData] = useState([]);
  const [selectedChildForOrder, setSelectedChildForOrder] = useState(null);
  const [showChangeChildSheet, setShowChangeChildSheet] = useState(false);
  const [leadDataFormVisible, setLeadDataFormVisible] = useState(false);
  const [openAddChildSheet, setOpenAddChildSheet] = useState(false);
  const [classCount, setClassCount] = useState(null);
  const [defCouponApplyLoading, setDefCouponApplyLoading] = useState(false);
  const [couponApplyLoading, setCouponApllyLoading] = useState(false);
  const [visibleNameSheet, setVisibleNameSheet] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentNameLoading, setParentNameLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  const {textColors, bgColor, darkMode, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const {loading, payment, message} = useSelector(paymentSelector);
  const confettiRef = useRef();
  const cannonWrapperRef = useRef();
  const {ipData} = useSelector(bookDemoSelector);
  const {customer, user} = useSelector(authSelector);
  const dispatch = useDispatch();
  const {children} = useSelector(userSelector);
  console.log('loading is0', loading);
  const {
    currentAgeGroup,
    currentSelectedBatch,
    levelText,
    currentLevel,
    price,
    strikeThroughPrice,
    courseDetails,
  } = useSelector(courseSelector);

  const toast = useToast();

  useEffect(() => {
    let classesSolds;
    if (classesSold && classesSold > 0) {
      classesSolds = classesSold;
    } else {
      classesSolds = currentLevel === 1 || currentLevel === 2 ? 12 : 24;
    }

    setClassCount(classesSolds);
  }, [classesSold, currentLevel]);

  // code to get user details if something is missing in user lead
  useEffect(() => {
    if (!user?.fullName || user.fullName === '') {
      setLeadDataFormVisible(false);
    }
    setTotalCredits(user?.credits || 0);
    setFullName(user?.fullName || '');

    const fetchOfferCodes = async () => {
      console.log('fetching offers');
      if (user) {
        const response = await getOfferCode({phone: user?.phone});

        const codes = await response.json();

        setOfferCodes(codes?.offerCodes);
      }
    };
    fetchOfferCodes();
  }, [user]);

  useEffect(() => {
    if (dropdownData.length > 0) {
      setSelectedChildForOrder(dropdownData[0]);
    }
  }, [dropdownData]);

  // Show payment failed message
  useEffect(() => {
    if (message) {
      Snackbar.show({text: message, textColor: COLORS.white});
      dispatch(setMessage(''));
    }
  }, [message]);

  useEffect(() => {
    if (currentSelectedBatch) {
      if (currentSelectedBatch?.type === 'solo') {
        const dateAndTime = moment(currentSelectedBatch?.startDate).format(
          'MMMM Do [at] h:mm A',
        );
        // console.log("date was", currentSelectedBatch?.)
        setDateTime(dateAndTime);
        return;
      }
      const date = new Date(currentSelectedBatch?.startDate._seconds * 1000);
      const dateAndTime = moment(date).format('MMMM Do [at] h:mm A');
      setDateTime(dateAndTime);
    }
  }, [currentSelectedBatch]);

  useEffect(() => {
    setAmount(price);
  }, [price]);

  useEffect(() => {
    const totalDiscounts =
      creditsValueApplied + couponDiscount + referralDiscount;
    const finalPrice = price - totalDiscounts;
    setAmount(finalPrice);
  }, [couponDiscount, creditsValueApplied, price, referralDiscount]);

  // useEffect(() => {
  //   if (payment === MESSAGES.PAYMENT_SUCCESS) {
  //     setVisible(true);
  //   }
  // }, [payment]);

  const saveParentName = async () => {
    try {
      if (!parentName) {
        Showtoast({text: 'Enter your name', toast, type: 'danger'});
        return;
      }

      setParentNameLoading(true);
      const response = await addParentNameToLead({
        leadId: user.leadId,
        fullName: parentName,
      });

      if (response.status === 200) {
        setFullName(parentName);
        setParentNameLoading(false);
        setVisibleNameSheet(false);
        Showtoast({text: 'Name added', toast});
        const updatedUser = {...user, fullName: parentName};
        dispatch(setUser(updatedUser));
        setParentName('');
      } else {
        Showtoast({text: 'Something went wrong', toast, type: 'danger'});
        setParentNameLoading(false);
      }
    } catch (error) {
      console.log(error);
      Showtoast({text: 'Something went wrong', toast, type: 'danger'});
      setParentNameLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!fullName) {
      // Showtoast({text: 'Add your name', toast, type: 'danger'});
      Snackbar.show({
        text: 'Please add your name',
        textColor: COLORS.white,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'Add',
          textColor: COLORS.white,
          onPress: () => setVisibleNameSheet(true),
        },
      });
      return;
    }

    if (!email) {
      setEmailErr('Enter your email address.');
      return;
    }

    if (!selectedChildForOrder?.name || !selectedChildForOrder?.age) {
      console.log('i am here s', children);
      if (!children || children?.length == 0) {
        Snackbar.show({
          text: 'Please Add Child first',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'Add',
            textColor: COLORS.white,
            onPress: () => setOpenAddChildSheet(true),
          },
        });
        return;
      } else {
        Showtoast({text: 'Please Select child.', toast, type: 'danger'});
        return;
      }
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
      bookingDetails: user,
      courseDetails,
      email,
      paymentMethod,
      currentLevel,
    };

    if (selectedCoupon) {
      body.offerCode = selectedCoupon.offerCode;
    }

    if (selectedReferralCode) {
      body.offerCode = selectedReferralCode;
    }

    if (couponApplied) {
      body.discountedPrice = amount;
    }

    body.childData = selectedChildForOrder;

    if (totalCreditsUsed > 0) {
      body.credits = totalCreditsUsed;
    }

    // console.log('giving body', body);
    if (!user?.email && email) {
      dispatch(setUser({...user, email: email}));
    }
    dispatch(startMakePayment(body));
    setEmailErr('');
  };

  const handleSoloBatchCheckOut = () => {
    if (!fullName) {
      // Showtoast({text: 'Add your name', toast, type: 'danger'});
      Snackbar.show({
        text: 'Please add your name',
        textColor: COLORS.white,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'Add',
          textColor: COLORS.white,
          onPress: () => setVisibleNameSheet(true),
        },
      });
      return;
    }

    if (!email) {
      setEmailErr('Enter your email address.');
      return;
    }

    if (!selectedChildForOrder?.name || !selectedChildForOrder?.age) {
      console.log('i am here s', children);
      if (!children || children?.length == 0) {
        Snackbar.show({
          text: 'Please Add Child first',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'Add',
            textColor: COLORS.white,
            onPress: () => setOpenAddChildSheet(true),
          },
        });
        return;
      } else {
        Showtoast({text: 'Please Select child.', toast, type: 'danger'});
        return;
      }
    }

    const currentUser = auth().currentUser;

    if (!currentUser) {
      setAuthVisible(true);
      return;
    }

    const startDateTime = currentSelectedBatch?.startDate;

    const body = {
      courseType: 'solo',
      leadId: user?.leadId,
      ageGroup: currentAgeGroup,
      courseId: courseDetails?.courseId,
      FCY: `${ipData?.currency?.code} ${price}`,
      promisedStartDate: startDateTime,
      promisedBatchFrequency: null,
      phone: user?.phone,
      fullName: user?.fullName, // TODO: this should be from user
      batchId: null,
      childName: selectedChildForOrder.name,
      email: email,
      childAge: selectedChildForOrder.age,
      timezone: user?.timezone,
      countryCode: user?.countryCode, // TODO: this should be from user
      source: 'app',
      batchType: 'unhandled',
      startDate: startDateTime,
      price: price,
      level: currentLevel,
      classesSold: classesSold || null,
      course_type: courseDetails?.course_type,
      levelText: levelText,
    };

    if (selectedCoupon) {
      body.offerCode = selectedCoupon.offerCode;
    }

    if (selectedReferralCode) {
      body.offerCode = selectedReferralCode;
    }

    if (couponApplied) {
      body.discountedPrice = amount;
    }

    if (totalCreditsUsed > 0) {
      body.credits = totalCreditsUsed;
    }

    // console.log('body  giving is =', body);
    console.log('i am here');
    if (!user?.email && email) {
      dispatch(setUser({...user, email: email}));
    }
    dispatch(makeSoloPayment({body, ipData, paymentMethod}));
  };

  const handleRefferalApply = async () => {
    try {
      console.log('applying refferal');
      const res = await fetch(`${BASE_URL}/admin/courses/checkReferralCode`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: couponCode,
          leadId: user?.leadId,
        }),
      });

      const refData = await res.json();
      if (refData.message == 'Referral code not valid') {
        setCouponMsg('Referral code not valid');
        setCouponApllyLoading(false);
        return;
      }

      if (refData.discountType === 'percentage') {
        discountValue = price * (refData?.discount / 100);
        console.log('discount', discountValue);
        setReferralDiscount(discountValue);
        setCouponDisCount(0);
        setCouponApplied(true);
        setSelectedCoupon(null);
        setSelectedReferralCode(couponCode);
        setCouponApllyLoading(false);
      }
    } catch (error) {
      setCouponApllyLoading(false);
      console.log('referral err', error.messsage);
    }
  };

  const applyCouponCode = () => {
    if (!couponCode || couponApplied) {
      return;
    }
    setCouponApllyLoading(true);

    console.log('coupon codeis', couponCode);
    if (
      couponCode.length > 3 &&
      couponCode.slice(0, 3).toLowerCase() === 'rfr'
    ) {
      handleRefferalApply();
      return;
    }

    const matchCoupons = offerCodes?.find(item => {
      return item.offerCode === couponCode;
    });

    if (matchCoupons) {
      setSelectedCoupon(matchCoupons);
      console.log('item matched');

      console.log('applying');
      if (matchCoupons?.discountType === 'flat') {
        console.log('flat coupon');
        let discountValue = matchCoupons?.discountValue;
        setAmount(amount - discountValue);
        setCouponDisCount(discountValue);
        setCouponApplied(true);
        setReferralDiscount(0);
        setSelectedReferralCode(null);
      } else if (matchCoupons?.discountType === 'percentage') {
        console.log('percentage coupon');
        let discountValue = price * (matchCoupons?.discountValue / 100);
        setAmount(amount - discountValue);
        setCouponDisCount(discountValue);
        // setAmount(
        //   parseInt(price - price * (matchCoupons?.discountValue / 100)),
        // ),
        setCouponApplied(true);
      }

      setCouponMsg('');
      setCouponApllyLoading(false);
    } else {
      setCouponApllyLoading(false);
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
    console.log('removing code');
    setDefCouponApplyLoading(true);
    setCouponApplied(false);
    setSelectedCoupon(null);
    setCouponCode('');
    setCouponDisCount(0);
    setReferralDiscount(0);
    setSelectedReferralCode(null);
    setDefCouponApplyLoading(false);
  };

  // console.log('selectedCoupon', selectedCoupon);

  const onClose = () => setVisible(false);

  const goToHome = () => {
    dispatch(resetCourseDetails());
    dispatch(setPaymentMessage(MESSAGES.PAYMENT_SUCCESS));
    navigation.navigate(SCREEN_NAMES.MAIN);
  };

  const applyDefaultCode = () => {
    console.log('applying code');

    setDefCouponApplyLoading(true);
    let discountValue = price * (10 / 100);
    setAmount(parseInt(amount - discountValue));
    setCouponApplied(true);
    setCouponCode('YLAPP10');
    setSelectedCoupon({
      discountType: 'percentage',
      discountValue: 10,
      offerCode: 'YLAPP10',
      offerName: 'App Download',
      validAbove: 1500,
    });
    setCouponDisCount(discountValue);
    setDefCouponApplyLoading(false);
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
      await auth().signInWithCredential(googleCredential);
      setAuthVisible(false);
      if (paymentBatchType === 'solo') {
        handleSoloBatchCheckOut();
      } else {
        handleCheckout();
      }
    } catch (error) {
      console.log('GoogleAuthenticationError', error.message);
    }
  }

  const redeemCredits = async () => {
    try {
      if (user.credits == 0) {
        return;
      }
      console.log('redeemin credits');
      const res = await fetch(`${BASE_URL}/admin/referrals/convertCredits`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          currency: ipData?.currency?.code,
          credits: user.credits,
          leadId: user?.leadId,
          price: price,
        }),
      });
      console.log('body is', {
        currency: ipData?.currency?.code,
        credits: user.credits,
        leadId: user?.leadId,
        price: amount || price,
      });

      const creditsToCurrency = await res.json();
      console.log('credits to currency', creditsToCurrency);
      const {price: convertedCredits, remainingCredits} = creditsToCurrency;
      // const finalValue = amount - convertedCredits;
      const utelizedCredits = user?.credits - remainingCredits;
      setTotalCreditsUsed(utelizedCredits);
      setTotalCredits(remainingCredits);
      setCreditsValueApplied(convertedCredits);
      // setAmount(finalValue);
    } catch (error) {
      console.log('convert credits error', error.message);
    }
  };

  useEffect(() => {
    if (children) {
      setDropDownData(children);
    }
  }, [children]);

  const FULL_NAME = useMemo(() => {
    return fullName ? (
      <TextWrapper
        fs={18}
        fw="700"
        styles={{textTransform: 'capitalize'}}
        color={textColors.textPrimary}>
        {fullName}
      </TextWrapper>
    ) : (
      <Pressable
        className="w-[140px] py-[6px] px-2 bg-blue-500 rounded items-center justify-center"
        onPress={() => setVisibleNameSheet(true)}>
        <Text className="text-white font-semibold">Add your name</Text>
      </Pressable>
    );
  }, [fullName, setVisibleNameSheet]);

  return (
    <View style={{flex: 1, backgroundColor: bgColor}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 12}}>
        <View
          style={[
            styles.card,
            {backgroundColor: darkMode ? bgSecondaryColor : '#fff'},
          ]}>
          {/* <TextWrapper
            fs={18}
            fw="700"
            styles={{textTransform: 'capitalize'}}
            color={textColors.textPrimary}>
            {user?.fullName}
          </TextWrapper> */}
          {FULL_NAME}

          <Spacer space={2} />
          <TextWrapper color={textColors.textSecondary}>
            {user?.phone}
          </TextWrapper>

          <View>
            <Text
              className="font-semibold text-[18px] mt-3"
              style={{color: textColors.textPrimary}}>
              Order For
            </Text>

            {dropdownData && dropdownData.length > 0 ? (
              <View className="flex-row justify-start w-full mt-3">
                <View className="w-[40%]">
                  <Text
                    className="font-semibold"
                    style={{color: textColors.textPrimary}}>
                    Child Name
                  </Text>
                  <Text
                    className="mt-1"
                    style={{color: textColors.textSecondary}}>
                    {selectedChildForOrder?.name}
                  </Text>
                </View>
                <View className="w-[25%]">
                  <Text
                    className="font-semibold "
                    style={{color: textColors.textPrimary}}>
                    Child Age
                  </Text>
                  <Text
                    className="mt-1"
                    style={{color: textColors.textSecondary}}>
                    {selectedChildForOrder?.age}
                  </Text>
                </View>
                <View className="flex justify-end ml-3">
                  <Pressable
                    className="py-[6px] px-2 bg-blue-500 rounded items-end "
                    onPress={() => setShowChangeChildSheet(true)}>
                    <Text className="text-white font-semibold">Change</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <View className="w-full">
                  <View className="w-full flex-row items-center">
                    <Text
                      className="text-base text-red-500"
                      style={{color: textColors.textSecondary}}>
                      You Don't have added Any Child
                    </Text>
                    <Pressable
                      className="py-1 px-3 rounded-full items-center ml-3"
                      style={{backgroundColor: COLORS.pblue}}
                      onPress={() => setOpenAddChildSheet(true)}>
                      <Text className="text-white font-semibold">Add one</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        <Spacer space={6} />
        <TextWrapper fs={20} fw="700" color={textColors.textPrimary}>
          Course Details
        </TextWrapper>
        <Spacer space={4} />
        <View
          style={[
            styles.card,
            {backgroundColor: darkMode ? bgSecondaryColor : '#fff'},
          ]}>
          <TextWrapper fs={18} fw="700" color={textColors.textPrimary}>
            Name:{' '}
            <TextWrapper fs={18} fw="600" color={textColors.textPrimary}>
              {courseDetails?.alternativeNameOnApp}
            </TextWrapper>
          </TextWrapper>
          <Spacer space={6} />
          <TextWrapper fs={18} fw="700" color={textColors.textPrimary}>
            Level:{' '}
            <TextWrapper fs={18} fw="600" color={textColors.textPrimary}>
              {levelText}
            </TextWrapper>
          </TextWrapper>
          <Spacer space={6} />
          {classCount && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <MIcon
                name="book-variant"
                size={26}
                color={textColors.textPrimary}
              />
              <TextWrapper fs={18} color={textColors.textPrimary}>
                Total Classes: {classCount}
              </TextWrapper>
            </View>
          )}
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon
              name="cake-variant"
              size={26}
              color={textColors.textPrimary}
            />
            <TextWrapper fs={18} color={textColors.textPrimary}>
              For Ages: {currentAgeGroup}
            </TextWrapper>
          </View>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon
              name="calendar-month"
              size={26}
              color={textColors.textPrimary}
            />
            <TextWrapper fs={18} color={textColors.textPrimary}>
              Start date: {dateTime}
            </TextWrapper>
          </View>
        </View>

        <Spacer space={4} />
        <View
          style={[
            styles.card,
            {backgroundColor: darkMode ? bgSecondaryColor : '#fff'},
          ]}>
          <TextInput
            placeholder="Enter email"
            style={[styles.emailInput, {color: textColors.textPrimary}]}
            textContentType="emailAddress"
            autoCorrect={false}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            value={email}
            onChangeText={e => setEmail(e)}
            selectionColor={textColors.textYlMain}
            placeholderTextColor={textColors.textSecondary}
          />
          {emailErr && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {emailErr}
            </TextWrapper>
          )}
        </View>
        <Spacer space={4} />
        <View
          style={[
            styles.card,
            {backgroundColor: darkMode ? bgSecondaryColor : '#fff'},
          ]}>
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
              Coupon Applied
            </TextWrapper>
            <Pressable
              className="flex-row"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                alignSelf: 'flex-end',
                backgroundColor: textColors.textYlMain,
                borderRadius: 50,
                marginBottom: 8,
              }}
              onPress={couponApplied ? clearAppliedCode : applyDefaultCode}>
              <TextWrapper ff={FONTS.signika_semiBold} color="white">
                {couponApplied ? 'Remove Coupon' : 'Apply Coupon YLAPP10'}
              </TextWrapper>
              {defCouponApplyLoading && (
                <ActivityIndicator
                  size={'small'}
                  color={'white'}
                  className="ml-1"
                />
              )}
            </Pressable>
          </View>
          <View>
            <TextWrapper
              styles={{marginBottom: 6}}
              color={textColors.textPrimary}>
              Have another code?
            </TextWrapper>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
              }}>
              <TextInput
                placeholder="Enter here"
                style={[
                  styles.emailInput,
                  {flex: 1},
                  {color: textColors.textPrimary},
                ]}
                autoCorrect={false}
                keyboardType="default"
                value={couponCode}
                onChangeText={e => setCouponCode(e)}
                selectionColor={textColors.textYlMain}
                placeholderTextColor={'gray'}
                autoCapitalize="characters"
              />
              <Pressable
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 4,
                  borderColor: 'gray',
                  backgroundColor: textColors.textYlGreen,
                  flexDirection: 'row',
                }}
                onPress={couponApplied ? clearAppliedCode : applyCouponCode}>
                <TextWrapper fs={18} color={'white'}>
                  {couponApplied ? 'Clear' : 'Apply'}
                </TextWrapper>

                {couponApplyLoading && (
                  <ActivityIndicator
                    size={'small'}
                    color={'white'}
                    className="ml-1"
                  />
                )}
              </Pressable>
            </View>
          </View>

          {customer === 'yes' && (
            <View className="flex-row justify-between items-center my-4 pt-1">
              <Text
                style={{
                  color: textColors.textPrimary,
                  fontFamily: FONTS.primaryFont,
                }}>
                {totalCredits} Redeem Points Available
              </Text>
              <Pressable onPress={redeemCredits} disabled={totalCredits == 0}>
                <Text
                  className="font-semibold underline"
                  style={{color: textColors.textYlMain}}>
                  Redeem Now
                </Text>
              </Pressable>
            </View>
          )}

          {couponMsg && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {couponMsg}
            </TextWrapper>
          )}
        </View>
      </ScrollView>
      <View style={{padding: 12}}>
        <View style={[styles.card, {backgroundColor: '#fff'}]}>
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

          {(creditsValueApplied > 0 ||
            couponDiscount > 0 ||
            referralDiscount > 0) && (
            <View className="py-1">
              <Text className="text-black text-[16px]">Discounts</Text>
              <View className=" mt-1">
                {couponDiscount > 0 && (
                  <View className="w-[85%] justify-between flex-row">
                    <Text className="text-[16px] text-black">Coupon Code</Text>
                    <Text className="text-[16px] text-black">
                      - {couponDiscount.toFixed(2)}
                    </Text>
                  </View>
                )}
                {creditsValueApplied > 0 && (
                  <View className="w-[85%] justify-between flex-row">
                    <Text className="text-[16px] text-black">Redeem Value</Text>
                    <Text className="text-[16px] text-black">
                      -{creditsValueApplied}
                    </Text>
                  </View>
                )}
                {referralDiscount > 0 && (
                  <View className="w-[85%] justify-between flex-row">
                    <Text className="text-[16px] text-black">
                      Referral Discount
                    </Text>
                    <Text className="text-[16px] text-black">
                      -{referralDiscount?.toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>

              <View className="mt-2 border-t-[.4px] border-gray-400 ">
                <View className="w-[85%] flex-row justify-between items-center">
                  <Text className="text-black text-[16px] font-semibold">
                    Nett Total
                  </Text>

                  <Text className="text-black text-[16px] font-semibold">{`${ipData?.currency.symbol}${amount}`}</Text>
                </View>
              </View>
            </View>
          )}

          <Spacer space={4} />
          <Pressable
            onPress={
              paymentBatchType && paymentBatchType === 'solo'
                ? handleSoloBatchCheckOut
                : handleCheckout
            }
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
            fallSpeed={1800}
            explosionSpeed={450}
          />
        </View>
      </View>

      <BottomSheetComponent
        isOpen={showChangeChildSheet}
        onClose={() => setShowChangeChildSheet(false)}
        Children={
          <ChangeChildModule
            data={dropdownData}
            setChild={setSelectedChildForOrder}
            selectChild={selectedChildForOrder}
            closeSheet={() => setShowChangeChildSheet(false)}
          />
        }
        snapPoint={['40%', '75%']}
      />

      {/* Add parent name */}
      <BottomSheetComponent
        isOpen={visibleNameSheet}
        onClose={() => setVisibleNameSheet(false)}
        style={{
          borderWidth: 1.25,
          borderColor: '#eaeaea',
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
        // keyboardBehavior="fillParent"
        Children={
          <View style={{width: '85%', paddingTop: 8}}>
            <BottomSheetTextInput
              placeholder="Enter your name"
              style={[styles.emailInput, {color: textColors.textPrimary}]}
              textContentType="name"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={parentName}
              onChangeText={e => setParentName(e)}
              selectionColor={textColors.textYlMain}
              placeholderTextColor={textColors.textSecondary}
            />
            <Pressable
              className="py-4 px-2 mt-3 bg-blue-500 rounded items-center justify-center flex-row"
              onPress={saveParentName}>
              <Text className="text-white font-semibold">Submit</Text>
              {parentNameLoading && (
                <ActivityIndicator
                  size={'small'}
                  color={COLORS.white}
                  style={{marginLeft: 4}}
                />
              )}
            </Pressable>
          </View>
        }
        snapPoint={['30%']}
      />

      <BottomSheetComponent
        isOpen={openAddChildSheet}
        onClose={() => setOpenAddChildSheet(false)}
        Children={
          <AddChildModule onClose={() => setOpenAddChildSheet(false)} />
        }
        snapPoint={['50%']}
      />

      <ModalComponent
        visible={leadDataFormVisible}
        animationType="fade"
        onRequestClose={() => setLeadDataFormVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}>
          <LeadDataForm
            setChild={setSelectedChildForOrder}
            child={selectedChildForOrder}
            close={() => setLeadDataFormVisible(false)}
          />
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

const ChangeChildModule = ({data, setChild, selectChild, closeSheet}) => {
  const {textColors, bgColor} = useSelector(state => state.appTheme);
  return (
    <View className="w-full items-center">
      <Text
        className="font-semibold text-3xl"
        style={{fontFamily: FONTS.headingFont, color: textColors.textYlMain}}>
        change child
      </Text>
      <View className="w-full items-center mt-4">
        {data?.map((child, i) => {
          return (
            <Pressable
              className="w-[90%] realtive mt-4"
              onPress={() => {
                setChild(child), closeSheet();
              }}
              key={i}>
              <View
                className="flex-row p-2 border border-gray-400 rounded"
                style={[
                  ,
                  selectChild?.name === child?.name
                    ? {borderColor: COLORS.pblue}
                    : {},
                ]}>
                {selectChild?.name === child?.name && (
                  <View
                    className="absolute -top-2 -right-2"
                    style={{backgroundColor: bgColor}}>
                    <MIcon
                      name="check-circle-outline"
                      size={25}
                      color={COLORS.pblue}
                    />
                  </View>
                )}

                <View className="ml-3">
                  <Text
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: FONTS.primaryFont,
                      color: textColors.textYlMain,
                    }}>
                    {child.name}
                  </Text>
                  <Text
                    className="mt-1"
                    style={{
                      fontFamily: FONTS.primaryFont,
                      color: textColors.textSecondary,
                    }}>
                    Age: {child.age}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const LeadDataForm = ({setChild, child, close}) => {
  const [orderChildData, setOrderChildData] = useState({
    childName: '',
    childAge: null,
  });
  const [leadName, setLeadName] = useState('');
  const toast = useToast();

  const handleSetChild = () => {
    if (!orderChildData?.childName || orderChildData?.childName?.length < 3) {
      Showtoast({text: 'Enter child name', toast, type: 'danger'});
      return;
    } else if (
      !orderChildData?.childAge ||
      orderChildData?.childAge < 5 ||
      orderChildData?.childAge > 14
    ) {
      Showtoast({text: 'Enter Childage between 5-14', toast, type: 'danger'});
      return;
    } else {
      setChild({
        name: orderChildData?.childName,
        age: orderChildData?.childAge,
      });
      close();
      // closeSheet();
    }
  };

  return (
    <View className="w-[100%] items-center">
      <View className=" bg-white rounded px-1 py-8 w-[95%]">
        <Text
          className="text-xl w-full text-center font-semibold text-black"
          style={{fontFamily: FONTS.primaryFont}}>
          Please Fill Your Basic Details
        </Text>

        <View className="mt-7 px-2">
          <View className="w-full">
            <Text className="font-semibold ">Enter Your Name:</Text>
            <TextInput
              // placeholder="Your Name"
              value={leadName}
              onChangeText={setLeadName}
              className="bg-gray-100 mt-1 border-b border-gray-400 p-1 text-base w-full text-[15px]"
            />
          </View>

          <View className="w-full mt-5 flex-row justify-between">
            <View className="w-[55%]">
              <Text className="font-semibold ">Enter Child Name:</Text>
              <TextInput
                value={orderChildData?.childName}
                onChangeText={e =>
                  setOrderChildData(pre => {
                    return {...pre, childName: e};
                  })
                }
                className=" mt-1 border-b border-gray-400 p-1 text-base w-full text-[15px] bg-gray-100"
              />
            </View>

            <View className="w-[40%]">
              <Text className="font-semibold ">Enter Child Age:</Text>
              <TextInput
                value={orderChildData?.childAge}
                keyboardType="phone-pad"
                onChangeText={e =>
                  setOrderChildData(pre => {
                    return {...pre, childAge: parseInt(e)};
                  })
                }
                className=" mt-1 border-b border-gray-400 p-1 text-base w-full text-[15px] bg-gray-100"
              />
            </View>
          </View>
          <Pressable
            className="w-full py-2 rounded mt-5 items-center"
            style={{backgroundColor: COLORS.pblue}}
            onPress={() => handleSetChild()}>
            <Text className="font-semibold text-white text-[16px]">
              Click to Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 4,
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
