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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
  setPhoneAsync,
  setDemoData,
  setShowJoinButton,
} from '../store/join-demo/join-demo.reducer';
import {resetCurrentNetworkState} from '../store/network/reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {networkSelector} from '../store/network/selector';

import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
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
import {getAppTestimonials} from '../utils/api/yl.api';

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

const {height: deviceHeight} = Dimensions.get('window');

const sectionOffsets = {
  tipsAndTricks: 0,
  worksheets: 0,
  improvements: 0,
  reviews: 0,
};

const HomeScreen = ({navigation}) => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [improvementsData, setImprovementsData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [tipsAndTricksData, setTipsandTricksData] = useState([]);
  const [contentData, setContentData] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const dispatch = useDispatch();

  const scrollViewRef = useRef(null);
  const [offsets, setOffsets] = useState(sectionOffsets);

  const {
    demoData,
    loading,
    demoPhoneNumber,
    bookingDetails,
    demoBookingId,
    teamUrl,
    isAttended,
    isAttendenceMarked,
    bookingTime,
  } = useSelector(joinDemoSelector);

  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);

  const {ipData} = useSelector(bookDemoSelector);

  async function onAuthStateChanged(user) {
    if (user) {
      try {
        const tokenResult = await auth().currentUser.getIdTokenResult();
        dispatch(setAuthToken(tokenResult.token));
      } catch (error) {
        console.error('Error getting ID token:', error);
      }
    }
  }

  // Auth listener
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('appState', nextAppState);
      if (nextAppState === 'active') {
      }
    };

    const appState = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appState.remove();
    };
  }, []);

  // App content
  useEffect(() => {
    const fetchAppTestimonials = async () => {
      try {
        setContentLoading(true);
        const res = await getAppTestimonials();
        const {data, content} = await res.json();
        const improvements = data.filter(item => item.type === 'improvements');
        const reviews = data.filter(item => item.type === 'review');
        const tips = data.filter(item => item.type === 'tips');
        setImprovementsData(improvements);
        setReviewsData(reviews);
        setTipsandTricksData(tips);
        setContentData(content);
        setContentLoading(false);
      } catch (error) {
        console.log('FETCH_APP_TESTIMONIALS_ERROR', error.message);
        setContentLoading(false);
      }
    };

    fetchAppTestimonials();
  }, []);

  // Check for customer
  useEffect(() => {
    if (bookingDetails) {
      dispatch(fetchUser({leadId: bookingDetails?.leadId}));
    }
  }, [bookingDetails]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Set demo phone number from localStorage to redux state
   */
  useEffect(() => {
    dispatch(setPhoneAsync());
  }, []);

  /**
   * @author Shobhit
   * @since 22/09/2023
   * @description Set parent name and phone as username to Sentry to specify errors
   */
  useEffect(() => {
    if (bookingDetails) {
      Sentry.setUser({
        username: `${bookingDetails.parentName}-${bookingDetails.phone}`,
      });
    }
  }, [bookingDetails]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Set demo phone number from localStorage to redux state
   */
  useEffect(() => {
    dispatch(setPhoneAsync());
  }, []);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description
   * set demo data
   */
  useEffect(() => {
    if (demoData) {
      dispatch(setDemoData({demoData, phone: demoPhoneNumber}));
    }
  }, [demoData]);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(async state => {
  //     if (state.isConnected && isConnected) {
  //       if (demoPhoneNumber) {
  //         dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
  //       } else if (demoBookingId) {
  //         dispatch(startFetchBookingDetailsFromId(demoBookingId));
  //       }
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [demoPhoneNumber, demoBookingId, dispatch, isConnected]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Call api to get booking status from phone number
   */
  useEffect(() => {
    if (demoPhoneNumber) {
      dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
    }
  }, [demoPhoneNumber, dispatch]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Call api to get booking status from booking id
   */
  useEffect(() => {
    if (demoBookingId) {
      dispatch(startFetchBookingDetailsFromId(demoBookingId));
    }
  }, [demoBookingId, dispatch]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description
   * Get demo data
   * If a user came after start class
   */
  useEffect(() => {
    if (isAttendenceMarked) {
      if (demoPhoneNumber) {
        dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
      }

      if (demoBookingId) {
        dispatch(startFetchBookingDetailsFromId(JSON.parse(demoBookingId)));
      }
    }
  }, [isAttendenceMarked]);

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
          setIsTimeover(true);
          clearInterval(timer);
          return;
        }

        if (new Date(bookingTime).getTime() - 1000 <= new Date().getTime()) {
          dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
        }

        // set time to show
        setTimeLeft(remaining);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [bookingTime, demoPhoneNumber, dispatch]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Do not show join button after 50 minutes of demo ended
   */
  useEffect(() => {
    if (bookingTime) {
      const afterHalfHourFromDemoDate =
        new Date(bookingTime).getTime() + 1000 * 60 * 50;

      // Check after demo ended
      if (afterHalfHourFromDemoDate <= Date.now()) {
        // Hide class join button
        dispatch(setShowJoinButton(false));
      }
    }
  }, [bookingTime, demoData]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Set  Notifications for demo class
   */
  // useEffect(() => {
  //   if (bookingTime) {
  //     dispatch(setDemoNotifications({bookingTime}));
  //   }
  // }, [bookingTime]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Post Actions after join class successfuly
   */
  useEffect(() => {
    if (!bookingTime) return;

    const isDemoOver =
      new Date(bookingTime).getTime() + 1000 * 60 * 50 <= Date.now();

    console.log('isDemoOver', isDemoOver);

    if (isDemoOver && isAttended && teamUrl) {
      console.log('post action true');
      setShowPostActions(true);
    } else {
      setShowPostActions(false);
    }
  }, [bookingTime, isAttended, teamUrl]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description show notification timer on notification panel
   */
  useEffect(() => {
    if (bookingTime) {
      const currentTime = Date.now();

      if (bookingTime > currentTime) {
        registerNotificationTimer(bookingTime);
      }
    }
  }, [bookingTime]);

  useEffect(() => {
    if (bookingTime) {
      const timeOver = bookingTime < Date.now();
      if (!timeOver) {
        setIsTimeover(false);
      }
    }
  }, [bookingTime]);

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
          text: 'CANCEL',
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
        {loading ? (
          <Spinner style={{alignSelf: 'center'}} />
        ) : (
          <Demo
            isTimeover={isTimeover}
            timeLeft={timeLeft}
            showPostActions={showPostActions}
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

            {/* Worksheets */}
            <Worksheets handleSectionLayout={handleSectionLayout} />

            {/* Video slider */}
            <View
              style={{paddingVertical: 16}}
              onLayout={event => handleSectionLayout('tipsAndTricks', event)}>
              <TextWrapper fs={19} fw="700" color="#434a52">
                {contentData?.tips?.heading}
              </TextWrapper>
              <TextWrapper color="gray">
                {contentData?.tips?.subheading}
              </TextWrapper>
              <Spacer />
              <FlatList
                data={tipsAndTricksData}
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
                  />
                )}
              />
            </View>

            {/* Video slider */}
            <View
              style={{paddingVertical: 16}}
              onLayout={event => handleSectionLayout('improvements', event)}>
              <TextWrapper fs={19} fw="700" color="#434a52">
                {contentData?.improvements?.heading}
              </TextWrapper>
              <TextWrapper color="gray">
                {contentData?.improvements?.subheading}
              </TextWrapper>
              <Spacer />
              <FlatList
                data={improvementsData}
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
                  />
                )}
              />
            </View>

            {/* Video slider */}
            <View
              style={{paddingVertical: 16}}
              onLayout={event => handleSectionLayout('reviews', event)}>
              <TextWrapper fs={19} fw="700" color="#434a52">
                {contentData?.reviews?.heading}
              </TextWrapper>
              <TextWrapper color="gray">
                {contentData?.reviews?.subheading}
              </TextWrapper>
              <Spacer />
              <FlatList
                data={reviewsData}
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
                  />
                )}
              />
            </View>
            {/* Reviews */}
            <View style={{paddingVertical: 16}}>
              <Reviews />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  topSection: {
    height: deviceHeight * 0.35,
    minHeight: 160,
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
});
