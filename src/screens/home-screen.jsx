import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Alert,
  StatusBar,
  FlatList,
  Dimensions,
  Image,
  AppState,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  startFetchBookingDetailsFromPhone,
  joinDemo,
  setDemoData,
} from '../store/join-demo/join-demo.reducer';
import {resetCurrentNetworkState} from '../store/network/reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {networkSelector} from '../store/network/selector';

import Spacer from '../components/spacer.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/constants/colors';
import TextWrapper from '../components/text-wrapper.component';

import {registerNotificationTimer} from '../natiive-modules/timer-notification';
import Demo from '../components/demo.component';

import * as Sentry from '@sentry/react-native';
import Reviews from '../components/reviews.component';

import Worksheets from '../components/worksheets.component';
import VideoPlayer from '../components/video.component';

// Icons
import TipsIcon from '../assets/icons/tipsandtricks.png';
import WorksheetIcon from '../assets/icons/document.png';
import ReviewIcon from '../assets/icons/reviews.png';
import ImprovementIcon from '../assets/icons/improvement.png';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';

import auth from '@react-native-firebase/auth';
import {fetchUser, setAuthToken} from '../store/auth/reducer';
import {FONTS} from '../utils/constants/fonts';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../utils/constants/local-keys';
import {localStorage} from '../utils/storage/storage-provider';
import {paymentSelector} from '../store/payment/selector';
import {MESSAGES} from '../utils/constants/messages';
import ModalComponent from '../components/modal.component';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import Icon from '../components/icon.component';
import {authSelector} from '../store/auth/selector';
import {setPaymentMessage} from '../store/payment/reducer';
import {saveDeviceId} from '../utils/deviceId';
import RatingPopup from '../components/popups/rating';
import {fetchContentDataStart} from '../store/content/reducer';
import {contentSelector} from '../store/content/selector';
import BottomSheet from '@gorhom/bottom-sheet';
import moment from 'moment';
import TwoStepForm from '../components/two-step-form.component';

const INITIAL_TIME = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const getTimeRemaining = bookingDate => {
  const countDownTime = new Date(bookingDate).getTime();
  const now = Date.now();

  const remainingTime = countDownTime - now;

  const days = Math.floor((remainingTime / (1000 * 60 * 60 * 24)) % 24);
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  if (remainingTime <= 0) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0, remainingTime};
  }

  return {days, hours, minutes, seconds, remainingTime};
};

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

const sectionOffsets = {
  tipsAndTricks: 0,
  worksheets: 0,
  improvements: 0,
  reviews: 0,
};

const HomeScreen = ({navigation, route}) => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  // const [isTimeover, setIsTimeover] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [visibleCred, setVisibleCred] = useState(false);
  const [offsets, setOffsets] = useState(sectionOffsets);
  const [ratingModal, setRatingModal] = useState(false);

  const routeData = route.params;

  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const bottomSheetRef = useRef();

  const {
    demoData,
    loading,
    demoPhoneNumber,
    bookingDetails,
    isAttended,
    bookingTime,
    isClassOngoing,
    demoFlag,
  } = useSelector(joinDemoSelector);

  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);

  const {ipData} = useSelector(bookDemoSelector);
  const {paymentMessage} = useSelector(paymentSelector);
  const {user} = useSelector(authSelector);
  const {contentData, contentLoading} = useSelector(contentSelector);

  useEffect(() => {
    const {data} = routeData;
    console.log('routeData', data);
    if (data?.redirectTo) {
      navigation.navigate(data.redirectTo);
    } else if (data?.rating) {
      setRatingModal(true);
    }
  }, [routeData]);

  // Save current screen name
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log('home focused..');
  //     localStorage.set(LOCAL_KEYS.CURRENT_SCREEN, 'home');
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // useEffect(() => {
  //   let timeout;
  //   const handleAppStateChange = async nextAppState => {
  //     try {
  //       console.log('appState', nextAppState);
  //       if (nextAppState === 'active') {
  //         console.log('hit active state');
  //         // const isClassJoined = localStorage.getString(LOCAL_KEYS.JOIN_CLASS);
  //         const demoTime = localStorage.getNumber(LOCAL_KEYS.DEMO_TIME);
  //         console.log('demoTime', demoTime);

  //         if (demoTime) {
  //           const time =
  //             moment().isAfter(moment(demoTime)) &&
  //             moment().isBefore(moment(demoTime).add(2, 'hours'));

  //           if (time) {
  //             console.log('fetching...');
  //             dispatch(startFetchBookingDetailsFromPhone());
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log('APPSTATEERROR', error);
  //     }
  //   };
  //   const appState = AppState.addEventListener('change', handleAppStateChange);
  //   return () => {
  //     appState.remove();
  //     if (timeout) clearTimeout(timeout);
  //   };
  // }, []);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Call api to get booking status from phone number
   */
  useEffect(() => {
    console.log('hit demoData');
    if (!demoData) {
      dispatch(startFetchBookingDetailsFromPhone());
      console.log('startFetchBookingDetailsFromPhone');
    }
  }, [demoData]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description
   * set demo data
   */
  useEffect(() => {
    if (demoData) {
      dispatch(setDemoData({demoData}));
    }
  }, [demoData]);

  useEffect(() => {
    dispatch(fetchContentDataStart());
  }, []);

  // fetch user data
  useEffect(() => {
    if (demoData) {
      dispatch(fetchUser({leadId: demoData?.leadId}));
    }
  }, [demoData]);

  // Show default booking bottom sheet
  useEffect(() => {
    if (!demoData) {
      bottomSheetRef.current && bottomSheetRef.current.collapse();
    }
  }, [demoData]);

  useEffect(() => {
    let timeout;
    if (paymentMessage === MESSAGES.PAYMENT_SUCCESS) {
      timeout = setTimeout(() => {
        setVisibleCred(true);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [paymentMessage]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Countdown Timer
   */
  useEffect(() => {
    let timer;

    if (bookingTime) {
      timer = setInterval(() => {
        const remaining = getTimeRemaining(bookingTime);
        if (remaining.remainingTime <= 0) {
          clearInterval(timer);
          return;
        }

        if (new Date(bookingTime).getTime() - 1000 <= new Date().getTime()) {
          dispatch(startFetchBookingDetailsFromPhone());
        }

        // set time to show
        setTimeLeft(remaining);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [bookingTime, dispatch]);

  useEffect(() => {
    if (demoData) {
      console.log('demoFlag', demoData.demoFlag);

      const demoTime = demoData?.demoDate?._seconds * 1000;
      if (
        moment().isBefore(moment(demoTime).add(1, 'hours')) &&
        moment().isAfter(moment(demoTime))
      ) {
        if (!demoData.demoFlag) {
          console.log('caling join demo...');
          Alert.alert('', 'caling join demo...');
          dispatch(joinDemo({bookingId: demoData.bookingId}));
        }
      }
    }
  }, [demoData]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description show notification timer on notification panel
   */
  // useEffect(() => {
  //   if (bookingTime) {
  //     const currentTime = Date.now();

  //     if (bookingTime > currentTime) {
  //       registerNotificationTimer(bookingTime);
  //     }
  //   }
  // }, [bookingTime]);

  // show drawer
  const handleShowDrawer = () => navigation.openDrawer();

  // Reschedule a class
  // const rescheduleFreeClass = () => {
  //   const {childAge, parentName, phone, childName} = bookingDetails;
  //   const formFields = {childAge, parentName, phone, childName};

  //   navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  // };

  if (!isConnected) {
    Alert.alert(
      '',
      'We cannot continue due to network problem. Please check your network connection.',
      [
        {
          text: 'Refresh',
          onPress: () => {
            dispatch(resetCurrentNetworkState());
            dispatch(alertAction);
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            dispatch(resetCurrentNetworkState());
          },
        },
      ],
    );
  }

  const scrollToSection = section => {
    if (scrollViewRef.current && offsets[section] !== undefined) {
      console.log('hit');
      scrollViewRef.current.scrollTo({
        y: offsets[section],
        animated: true,
      });
    }
  };

  const handleSectionLayout = (section, event) => {
    const {y} = event.nativeEvent.layout;
    setOffsets(p => ({...p, [section]: y}));
  };

  const copyCredentials = cred => {
    Clipboard.setString(cred);
    Snackbar.show({
      text: 'Copied.',
      textColor: COLORS.white,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const closeModal = () => {
    dispatch(setPaymentMessage(''));
    setVisibleCred(false);
  };

  const redirectToWebsite = async () => {
    try {
      const WEBSITE_URL = 'https://www.younglabs.in/';
      await Linking.openURL(WEBSITE_URL);
    } catch (error) {
      console.log('OPEN_ABOUT_US_URL_ERROR', error);
    }
  };

  const bottomSheetSnappoint = `${Math.round(
    ((deviceHeight * 0.65) / deviceHeight) * 100,
  )}%`;

  const openBottomSheet = () => {
    bottomSheetRef.current && bottomSheetRef.current.collapse();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current && bottomSheetRef.current.close();
  };

  // console.log('demoData', demoData);
  // console.log('isClassOnging', isClassOngoing);
  // console.log('timeLeft', timeLeft);

  return (
    <View style={{flex: 1, backgroundColor: '#76c8f2'}}>
      <View style={styles.topSection}>
        <StatusBar backgroundColor={'#76c8f2'} barStyle={'light-content'} />
        <View style={styles.header}>
          <TextWrapper
            fs={18}
            color={COLORS.white}
            styles={{textTransform: 'capitalize'}}>
            English handwriting
          </TextWrapper>
          <View style={styles.rightNavButtons}>
            {/* <LanguageSelection /> */}
            <Pressable onPress={handleShowDrawer}>
              <MIcon name="account-circle" size={28} color={COLORS.white} />
            </Pressable>
          </View>
        </View>
        {/* <Button
          onPress={() => navigation.navigate(SCREEN_NAMES.COURSE_DETAILS)}>
          Course
        </Button> */}
        {loading ? (
          // <Spinner style={{alignSelf: 'center'}} />
          <ActivityIndicator
            size={'large'}
            color={COLORS.white}
            style={{alignSelf: 'center', marginTop: 16}}
          />
        ) : (
          <Demo
            // isClassOngoing={isClassOngoing}
            timeLeft={timeLeft}
            // showPostActions={showPostActions}
            openBottomSheet={openBottomSheet}
          />
        )}
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={[
          styles.container,
          {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: '#FFF',
            elevation: StyleSheet.hairlineWidth,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bouncesZoom={false}
        contentContainerStyle={{
          paddingBottom: StatusBar.currentHeight * 0.6,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
        {contentLoading ? (
          <ActivityIndicator
            size={'large'}
            color={COLORS.black}
            style={{alignSelf: 'center', marginTop: 16}}
          />
        ) : (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
                paddingVertical: 8,
                rowGap: 16,
                justifyContent: 'space-between',
              }}>
              <Pressable
                style={[styles.iconRow]}
                onPress={() => scrollToSection('tipsAndTricks')}>
                <View style={styles.iconContainer}>
                  <Image style={styles.icon} source={TipsIcon} />
                </View>
                <TextWrapper fw="500" color={'#0352b3'}>
                  Tips & Tricks
                </TextWrapper>
              </Pressable>
              <Pressable
                style={styles.iconRow}
                onPress={() => scrollToSection('worksheets')}>
                <View style={[styles.iconContainer, {width: 46, height: 46}]}>
                  <Image style={styles.icon} source={WorksheetIcon} />
                </View>

                <TextWrapper fw="500" color={'#0352b3'}>
                  Worksheets
                </TextWrapper>
              </Pressable>
              <Pressable
                style={[styles.iconRow]}
                onPress={() => scrollToSection('reviews')}>
                <View style={styles.iconContainer}>
                  <Image
                    style={[styles.icon, {width: 46, height: 46}]}
                    source={ReviewIcon}
                  />
                </View>
                <TextWrapper fw="500" color={'#0352b3'}>
                  Reviews
                </TextWrapper>
              </Pressable>
              <Pressable
                style={styles.iconRow}
                onPress={() => scrollToSection('improvements')}>
                <View style={styles.iconContainer}>
                  <Image style={styles.icon} source={ImprovementIcon} />
                </View>
                <TextWrapper fw="500" color={'#0352b3'}>
                  Before & After
                </TextWrapper>
              </Pressable>
            </View>

            <Spacer />

            {/* Video slider */}
            <View
              style={{paddingVertical: 16}}
              onLayout={event => handleSectionLayout('reviews', event)}>
              <TextWrapper
                fs={21}
                fw="600"
                color="#434a52"
                ff={FONTS.signika_medium}>
                {contentData?.content?.reviews?.heading}
              </TextWrapper>
              <TextWrapper color="gray" fs={20} ff={FONTS.dancing_script}>
                {contentData?.content?.reviews?.subheading}
              </TextWrapper>
              <Spacer />
              <FlatList
                data={contentData?.reviews}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{marginHorizontal: 8}} />
                )}
                renderItem={({item}) => (
                  <VideoPlayer
                    key={item.id}
                    uri={item.uri}
                    poster={item.poster}
                    thumbnailText={item?.thumbnailText}
                    aspectRatio={9 / 16}
                  />
                )}
              />
            </View>

            {/* Worksheets */}
            {/* <Worksheets handleSectionLayout={handleSectionLayout} /> */}

            {/* Video slider */}
            <View
              style={{paddingVertical: 16}}
              onLayout={event => handleSectionLayout('tipsAndTricks', event)}>
              <TextWrapper
                fs={21}
                fw="600"
                color="#434a52"
                ff={FONTS.signika_semiBold}>
                {contentData?.content?.tips?.heading}
              </TextWrapper>
              <TextWrapper fs={20} color="gray" ff={FONTS.dancing_script}>
                {contentData?.content?.tips?.subheading}
              </TextWrapper>
              <Spacer />
              <FlatList
                data={contentData?.tips}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{marginHorizontal: 8}} />
                )}
                renderItem={({item}) => (
                  <VideoPlayer
                    key={item.id.toString()}
                    uri={item.uri}
                    poster={item.poster}
                    thumbnailText={item?.thumbnailText}
                    aspectRatio={9 / 16}
                  />
                )}
              />
            </View>

            {/* Video slider */}
            <View
              style={{paddingVertical: 16}}
              onLayout={event => handleSectionLayout('improvements', event)}>
              <TextWrapper
                fs={21}
                fw="600"
                color="#434a52"
                ff={FONTS.signika_semiBold}>
                {contentData?.content?.improvements?.heading}
              </TextWrapper>
              <TextWrapper color="gray" fs={20} ff={FONTS.dancing_script}>
                {contentData?.content?.improvements?.subheading}
              </TextWrapper>
              <Spacer />
              <FlatList
                data={contentData?.improvements}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{marginHorizontal: 8}} />
                )}
                renderItem={({item}) => (
                  <VideoPlayer
                    key={item.id.toString()}
                    uri={item.uri}
                    poster={item.poster}
                    thumbnailText={item?.thumbnailText}
                    aspectRatio={16 / 9}
                    width={deviceWidth - 32}
                  />
                )}
              />
            </View>

            {/* Reviews */}
            <View style={{paddingVertical: 16}}>
              <TextWrapper
                fs={21}
                fw="600"
                color="#434a52"
                ff={FONTS.signika_semiBold}>
                {contentData?.content?.rating?.heading}
              </TextWrapper>
              <TextWrapper color="gray" fs={20} ff={FONTS.dancing_script}>
                {contentData?.content?.rating?.subheading}
              </TextWrapper>
              <Spacer />
              <Reviews />
            </View>
          </>
        )}
      </ScrollView>
      <ModalComponent
        visible={visibleCred}
        onRequestClose={() => setVisibleCred(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <View style={{paddingHorizontal: 16}}>
            <View
              style={{
                padding: 12,
                backgroundColor: COLORS.white,
                borderRadius: 12,
                elevation: 10,
              }}>
              <TextWrapper fs={19} ff={FONTS.signika_medium}>
                Copy credentials and login to our website
              </TextWrapper>
              <Spacer space={12} />
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 6,
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: 'gray',
                  position: 'relative',
                }}>
                <TextWrapper fs={16.5}>{user?.email}</TextWrapper>
                <Icon
                  name="copy-outline"
                  size={24}
                  color={'gray'}
                  onPress={() => copyCredentials(user?.email)}
                />
                <TextWrapper
                  styles={{
                    position: 'absolute',
                    top: '-50%',
                    left: 16,
                    backgroundColor: COLORS.white,
                    paddingHorizontal: 2,
                  }}>
                  Email
                </TextWrapper>
              </View>
              <Spacer space={12} />
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 6,
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: 'gray',
                  position: 'relative',
                }}>
                <TextWrapper
                  fs={16.5}>{`younglabs${user?.leadId}`}</TextWrapper>
                <Icon
                  name="copy-outline"
                  size={24}
                  color={'gray'}
                  onPress={() => copyCredentials(`younglabs${user?.leadId}`)}
                />
                <TextWrapper
                  styles={{
                    position: 'absolute',
                    top: '-50%',
                    left: 16,
                    backgroundColor: COLORS.white,
                    paddingHorizontal: 2,
                  }}>
                  Password
                </TextWrapper>
              </View>
              <Spacer space={12} />
              <Pressable
                style={({pressed}) => [
                  styles.btnCancel,
                  {backgroundColor: pressed ? '#f5f5f5' : '#eee'},
                ]}
                onPress={redirectToWebsite}>
                <TextWrapper color={COLORS.black}>Go to website</TextWrapper>
              </Pressable>
              <Spacer space={4} />
              <Pressable
                style={({pressed}) => [
                  styles.btnCancel,
                  {backgroundColor: pressed ? '#f5f5f5' : '#eee'},
                ]}
                onPress={closeModal}>
                <TextWrapper color={COLORS.black}>Cancel</TextWrapper>
              </Pressable>
            </View>
          </View>
        </View>
      </ModalComponent>
      <RatingPopup
        visible={ratingModal}
        onClose={() => setRatingModal(false)}
        bookingId={demoData?.bookingId}
      />
      <BottomSheet
        index={-1}
        snapPoints={[bottomSheetSnappoint, '90%']}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        style={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          elevation: 12,
        }}>
        <TwoStepForm closeModal={closeBottomSheet} />
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  topSection: {
    height: deviceHeight * 0.35,
  },
  container: {
    flex: 1,
  },
  cameraView: {
    height: 180,
    backgroundColor: '#eaeaea',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  hImage: {
    width: '100%',
    height: 180,
    objectFit: 'contain',
  },
  btnClose: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  btnUpload: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  improvements: {
    paddingTop: 12,
  },
  improvementItem: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  pdf: {
    flex: 1,
  },
  worksheet: {
    height: 140,
  },
  worksheets: {
    flexDirection: 'row',
    gap: 4,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 428,
    alignSelf: 'center',
  },
  rightNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  iconContainer: {
    width: 50,
    height: 50,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 4,
    backgroundColor: '#fff',
    borderRadius: 7,
    elevation: 4,
  },
  btnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 24,
  },
});
