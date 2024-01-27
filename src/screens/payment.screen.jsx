import React, {useState, useEffect, useRef} from 'react';
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
import {authSelector} from '../store/auth/selector';
import {BASE_URL} from '@env';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import DropdownComponent from '../components/DropdownComponent';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';

GoogleSignin.configure({
  webClientId:
    '351274768066-ftkfamveov8pb1nkd558fv0mrur546lf.apps.googleusercontent.com',
});

const {width: deviceWidth} = Dimensions.get('window');

const Payment = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [offerCodes, setOfferCodes] = useState([]);
  const [couponCode, setCouponCode] = useState('');

  const [amount, setAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [visibleCongratulations, setVisibleCongratulations] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

  // reducers values
  const {user} = useSelector(authSelector);

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
  console.log('selected Child for order', selectedChildForOrder);

  const [totalDiscounts, setTotalDiscounts] = useState();
  const {userOrders} = useSelector(welcomeScreenSelector);

  // code to get user details if something is missing in user lead
  useEffect(() => {
    if (!user?.fullName || user.fullName === '') {
      setLeadDataFormVisible(false);
    }
  }, [user]);

  useEffect(() => {
    if (dropdownData.length > 0) {
      setSelectedChildForOrder(dropdownData[0]);
    }
  }, [dropdownData]);

  // console.log('total discounts are', totalDiscounts);

  useEffect(() => {
    setTotalCredits(user?.credits || 0);
  }, [user]);

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

  // console.log("current seelcted batch is " , currentSelectedBatch)

  const {loading, payment, message} = useSelector(paymentSelector);
  const confettiRef = useRef();
  const cannonWrapperRef = useRef();
  const {bookingDetails} = useSelector(joinDemoSelector);
  const {selectedChild, userBookings} = useSelector(welcomeScreenSelector);
  const {ipData} = useSelector(bookDemoSelector);

  const {customer} = useSelector(authSelector);
  const dispatch = useDispatch();

  // console.log("selected child is", selectedChild);
  // console.log("offer codes are", offerCodes);

  // Set current screen name

  useEffect(() => {
    setAmount(price);
  }, [price]);

  useEffect(() => {
    const totalDiscounts =
      creditsValueApplied + couponDiscount + referralDiscount;
    const finalPrice = price - totalDiscounts;
    setAmount(finalPrice);
  }, [couponDiscount, creditsValueApplied, price, referralDiscount]);

  // console.log('user is', user);
  useEffect(() => {
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

    // console.log('currentuser is', currentUser);

    if (!currentUser) {
      setAuthVisible(true);
      return;
    }

    // console.log('selected child here', selectedChild);

    const body = {
      price,
      strikeThroughPrice,
      currentSelectedBatch,
      levelText,
      ipData,
      bookingDetails: user,
      courseDetails,
      email,
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
    dispatch(startMakePayment(body));

    setEmailErr('');
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
      }
    } catch (error) {
      console.log('referral err', error.messsage);
    }
  };

  const applyCouponCode = () => {
    if (!couponCode || couponApplied) {
      return;
    }

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
    setCouponApplied(false);
    setSelectedCoupon(null);
    setCouponCode('');
    setCouponDisCount(0);
    setReferralDiscount(0);
    setSelectedReferralCode(null);
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
      await auth().signInWithCredential(googleCredential);
      setAuthVisible(false);
    } catch (error) {
      console.log('GoogleAuthenticationError', error.message);
    }
  }

  // const getToken = async()=>{
  //   let token = await auth().currentUser.getIdToken()
  //   console.log("token is",token)
  // }

  // getToken()
  // referral and coupon handlers

  const redeemCredits = async () => {
    try {
      if (user.credits == 0) {
        return;
      }

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
      const creditsToCurrency = await res.json();
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
    if (customer === 'yes') {
      let dataToStore = [];
      if (typeof userOrders === 'object') {
        Object.keys(userOrders).map((key, i) => {
          userOrders[key].map((item, i) => {
            dataToStore.push({
              childName: item.childName,
              childAge: item.childAge,
            });
          });
        });
      }
      setSelectedChildForOrder(dataToStore[0]);
      setDropDownData(dataToStore);
    } else {
      let dataToStore = [];
      // console.log("userBookings",userBookings);

      if (userBookings?.length > 0) {
        userBookings.map((item, i) => {
          dataToStore.push({
            childName: item.childName,
            childAge: item.childAge,
          });
          // return;
        });

        setDropDownData(dataToStore);
      }
    }
  }, [userOrders, userBookings]);

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 12}}>
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700" styles={{textTransform: 'capitalize'}}>
            {user?.fullName}
          </TextWrapper>

          <Spacer space={2} />
          <TextWrapper>{user?.phone}</TextWrapper>

          <View>
            <Text className="font-semibold text-[18px] mt-3">Order For</Text>

            {dropdownData && dropdownData.length > 0 ? (
              <View className="flex-row justify-start w-full mt-3">
                <View className="w-[40%]">
                  <Text className="font-semibold">Child Name</Text>
                  <Text className="mt-1">
                    {selectedChildForOrder?.childName}
                  </Text>
                </View>
                <View className="w-[25%]">
                  <Text className="font-semibold">Child Age</Text>
                  <Text className="mt-1">
                    {selectedChildForOrder?.childAge}
                  </Text>
                </View>
                <View className="flex justify-end ml-3">
                  <Pressable
                    className="p-1 bg-blue-500 rounded items-end "
                    onPress={() => setShowChangeChildSheet(true)}>
                    <Text className="text-white font-semibold">Change</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <View className="w-full">
                  <View className="w-full mt-5 flex-row justify-between">
                    <View className="w-[55%]">
                      <Text className="font-semibold ">Enter Child Name:</Text>
                      <TextInput
                        value={selectedChildForOrder?.childName}
                        onChangeText={e =>
                          setSelectedChildForOrder(pre => {
                            return {...pre, childName: e};
                          })
                        }
                        className=" mt-1 border-b border-gray-400 p-1 text-base w-full text-[15px] bg-gray-100"
                      />
                    </View>

                    <View className="w-[40%]">
                      <Text className="font-semibold ">Enter Child Age:</Text>
                      <TextInput
                        value={selectedChildForOrder?.childAge}
                        keyboardType="phone-pad"
                        onChangeText={e =>
                          setSelectedChildForOrder(pre => {
                            return {...pre, childAge: parseInt(e)};
                          })
                        }
                        className=" mt-1 border-b border-gray-400 p-1 text-base w-full text-[15px] bg-gray-100"
                      />
                    </View>
                  </View>
                </View>
              </>
            )}

            {/* {selectedChildForOrder === 'addAnother' ? (
              <View className="flex-row justify-between w-full mt-3">
                <View className="w-[55%]">
                  <Text>Child Name</Text>
                  <TextInput
                    placeholder=""
                    value={orderChildData?.childName}
                    onChangeText={e =>
                      setOrderChildData(pre => {
                        return {...pre, childName: e};
                      })
                    }
                    className="border-b border-gray-400 p-1 text-base w-full"
                  />
                </View>
                <View className="w-[40%]">
                  <Text>Child Age</Text>
                  <TextInput
                    placeholder=""
                    value={orderChildData?.childAge}
                    keyboardType="phone-pad"
                    onChangeText={e =>
                      setOrderChildData(pre => {
                        return {...pre, childAge: parseInt(e)};
                      })
                    }
                    className="border-b border-gray-400 p-1 text-base w-full"
                  />
                </View>
              </View>
            ) : (
              <DropdownComponent
                data={dropdownData}
                placeHolder="Select Child Age"
                setSelectedValue={setSelectedChildForOrder}
                // defaultSelectedItem={dropdownData[0]}
              />
            )} */}
          </View>
        </View>
        <Spacer space={6} />
        <TextWrapper fs={20} fw="700">
          Course Detailss
        </TextWrapper>
        <Spacer space={4} />
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700">
            Name:{' '}
            <TextWrapper fs={18} fw="600">
              {courseDetails?.alternativeNameOnApp}
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
              Total Classes:{' '}
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

          <View className="flex-row justify-between items-center my-4 pt-1">
            <Text>{totalCredits} Redeem Points Available</Text>
            <Pressable onPress={redeemCredits} disabled={totalCredits == 0}>
              <Text className="text-blue-600">Reddem Now</Text>
            </Pressable>
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
                      - {couponDiscount}
                    </Text>
                  </View>
                )}
                {creditsValueApplied > 0 && (
                  <View className="w-[85%] justify-between flex-row">
                    <Text className="text-[16px] text-black">Redeem Value</Text>
                    <Text className="text-[16px] text-black">
                      {creditsValueApplied}
                    </Text>
                  </View>
                )}
                {referralDiscount > 0 && (
                  <View className="w-[85%] justify-between flex-row">
                    <Text className="text-[16px] text-black">
                      Referral Discount
                    </Text>
                    <Text className="text-[16px] text-black">
                      {referralDiscount}
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

const ChangeChildModule = ({data, setChild, selectChild, closeSheet}) => {
  const [orderChildData, setOrderChildData] = useState({
    childName: '',
    childAge: '',
  });
  const toast = useToast();

  const addAnotherChild = () => {
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
      setChild(orderChildData);
      closeSheet();
    }
  };
  return (
    <View className="w-full items-center">
      <Text
        className="font-semibold text-3xl"
        style={{fontFamily: FONTS.headingFont}}>
        change child
      </Text>

      <View className="p-2  w-[100%] mt-3 bg-gray-100 rounded">
        <Text
          className="text-base font-semibold"
          style={{fontFamily: FONTS.primaryFont}}>
          Buying for another child?
        </Text>

        <View className="w-full flex-row justify-between mt-3">
          <View className="w-[40%]">
            <TextInput
              placeholder="Child Name"
              value={orderChildData?.childName}
              onChangeText={e =>
                setOrderChildData(pre => {
                  return {...pre, childName: e};
                })
              }
              className="border-b border-gray-400 p-1 text-[15px] w-full"
            />
          </View>
          <View className="w-[30%]">
            <TextInput
              placeholder="Child Age"
              value={orderChildData?.childAge}
              keyboardType="phone-pad"
              onChangeText={e =>
                setOrderChildData(pre => {
                  return {...pre, childAge: parseInt(e)};
                })
              }
              className="border-b border-gray-400 p-1 text-base w-full text-[15px]"
            />
          </View>

          <View className="items-end justify-end w-[23%]">
            <Pressable
              className="rounded items-center justify-center h-[30px] px-2"
              style={{backgroundColor: COLORS.pblue}}
              onPress={() => addAnotherChild()}>
              <Text className="text-white text-xs font-semobold ">
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="w-full items-center mt-4">
        {data?.map((child, i) => {
          return (
            <Pressable
              className="w-[90%] realtive mt-2"
              onPress={() => {
                setChild(child), closeSheet();
              }}
              key={i}>
              <View
                className="flex-row p-2 border border-gray-400 rounded"
                style={
                  selectChild?.childName === child?.childName
                    ? {borderColor: COLORS.pblue}
                    : {}
                }>
                {selectChild?.childName === child?.childName && (
                  <View
                    className="absolute -top-2 -right-2 bg-white"
                    style={{}}>
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
                    style={{fontFamily: FONTS.primaryFont}}>
                    {child.childName}
                  </Text>
                  <Text
                    className="mt-1"
                    style={{fontFamily: FONTS.primaryFont}}>
                    Age: {child.childAge}
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
      setChild(orderChildData);
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

// const SetChildDataModule = ({setChild}) => {
//   const [orderChildData, setOrderChildData] = useState({
//     childName: '',
//     childAge: null,
//   });

//   const toast = useToast();

//   // const handleSetChild = () => {
//   //   if (!orderChildData?.childName || orderChildData?.childName?.length < 3) {
//   //     Showtoast({text: 'Enter child name', toast, type: 'danger'});
//   //     return;
//   //   } else if (
//   //     !orderChildData?.childAge ||
//   //     orderChildData?.childAge < 5 ||
//   //     orderChildData?.childAge > 14
//   //   ) {
//   //     Showtoast({text: 'Enter Childage between 5-14', toast, type: 'danger'});
//   //     return;
//   //   } else {
//   //     setChild(orderChildData);
//   //     // closeSheet();
//   //   }
//   // };

//   useEffect(() => {
//     setChild(setOrderChildData);
//   }, [orderChildData]);

//   return (

//   );
// };

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
