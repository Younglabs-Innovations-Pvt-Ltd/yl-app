import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
  setPhoneAsync,
  setDemoData,
  setShowJoinButton,
  setDemoPhone,
  setBookingDetailSuccess,
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
import {SCREEN_NAMES} from '../utils/constants/screen-names';

import NetInfo from '@react-native-community/netinfo';
import DocumentPicker, {types} from 'react-native-document-picker';

import Storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

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
import {setAuthToken} from '../store/auth/reducer';
import {authSelector} from '../store/auth/selector';

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

const sliderData = [
  {
    id: 1,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/Testimonials%2FVID-20221216-WA0000.mp4?alt=media&token=03d809aa-17db-4fd3-b33f-f0b5a11df334',
    text: "Aarav's handwriting and writing speed improved significantly with the help of the english handwriting course. The techniques taught were effective and easy to follow.",
    poster:
      'https://images.unsplash.com/photo-1700044929627-a3eb69dd72cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8',
  },
  {
    id: 2,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/Testimonials%2FVideo%20from%20Sanjeev%20(3).mp4?alt=media&token=06c62196-e66e-410a-a6f7-0fb4ec23f187',
    text: "Thanks to Younglabs, my child's confidence in her studies has increased significantly, and it's showing in her exam results. I am grateful for your assistance in her learning journey.",
    poster:
      'https://images.unsplash.com/photo-1700044929627-a3eb69dd72cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8',
  },
  {
    id: 3,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/Testimonials%2FVID-20221218-WA0015.mp4?alt=media&token=80938b38-8a24-4109-9055-5d91fc4764d7',
    text: "Thanks for your help in my child's learning journey. Younglabs is excellent for kids and has helped my child learn and grow. It was a great learning experience, and we appreciate it.",
    poster:
      'https://images.unsplash.com/photo-1700044929627-a3eb69dd72cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8',
  },
];

const improvementsData = [
  {
    id: 1,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/app%2Fvideos%2FVID-20231110-WA0005_2.mp4?alt=media&token=6cac75ab-72a5-4543-baf4-bdd09166b3c6',
    poster:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/app%2Fposters%2F20231117_140520.jpg?alt=media&token=5229a45d-0385-4283-a0a3-97bab115f7ff',
  },
  {
    id: 2,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/app%2Fvideos%2FVID-20231116-WA0000_1.mp4?alt=media&token=2d113ed1-be6c-43f2-ac9d-aac43e885f9b',
    poster:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/app%2Fposters%2F20231117_140559.jpg?alt=media&token=1bca0085-c534-4ef4-a776-ae78fe14a2b3',
  },
];

const tipsAndTricksData = [
  {
    id: 1,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/app%2Fvideos%2FVID-20231124-WA0005.mp4?alt=media&token=6f9db89f-86b2-4988-be66-3352a6a271df',
  },
  {
    id: 2,
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/app%2Fvideos%2FVID-20231119-WA0023.mp4?alt=media&token=c30092d2-dfc0-4960-a3a9-ec2a1de76fad',
  },
];

const {height: deviceHeight} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

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
  const {email} = useSelector(authSelector);

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

  // Check if lead converted to customer
  useEffect(() => {
    if (email) {
    }
  }, [email]);

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected && isConnected) {
        if (demoPhoneNumber) {
          dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
        } else if (demoBookingId) {
          dispatch(startFetchBookingDetailsFromId(demoBookingId));
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [demoPhoneNumber, demoBookingId, dispatch, isConnected]);

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
  const rescheduleFreeClass = () => {
    const {childAge, parentName, phone, childName} = bookingDetails;
    const formFields = {childAge, parentName, phone, childName};

    navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  };

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

  const pickFile = async () => {
    await DocumentPicker.pick({
      type: [types.images],
    })
      .then(result => setSelectedImage(result[0]))
      .catch(err => console.log(err));
  };

  const closeImage = () => setSelectedImage(null);

  const uploadHandwritingImage = async () => {
    try {
      const base64 = await RNFS.readFile(selectedImage.uri, 'base64');
      const fileUri = `data:${selectedImage.type};base64,${base64}`;

      const storageRef = Storage().ref(
        '/app/handwritingSamples/' + selectedImage.name,
      );
      const task = storageRef.putString(fileUri, 'data_url');
      //   setFileLoading(true);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });

      task.then(async () => {
        const downloadUrl = await storageRef.getDownloadURL();
        console.log(downloadUrl);
        // const messageRef = database().ref('/messages/' + Date.now());
        // await messageRef.set({
        //   id: Date.now(),
        //   type: file.type,
        //   url: downloadUrl,
        //   username,
        // });
        // setFileLoading(false);
      });
    } catch (error) {
      console.log('UPLOAD_HANDWRITING_IMAGE_ERROR=', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#04364A'}}>
      <View style={styles.topSection}>
        <StatusBar backgroundColor={'#04364A'} barStyle={'light-content'} />
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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            paddingVertical: 8,
            rowGap: 16,
            // columnGap: 4,
            justifyContent: 'space-between',
          }}>
          <View style={[styles.iconRow]}>
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={TipsIcon} />
            </View>
            <TextWrapper>Tips & Tricks</TextWrapper>
          </View>
          <View style={styles.iconRow}>
            <View style={[styles.iconContainer, {width: 46, height: 46}]}>
              <Image style={styles.icon} source={WorksheetIcon} />
            </View>
            <TextWrapper>Worksheets</TextWrapper>
          </View>
          <View style={[styles.iconRow]}>
            <View style={styles.iconContainer}>
              <Image
                style={[styles.icon, {width: 46, height: 46}]}
                source={ReviewIcon}
              />
            </View>
            <TextWrapper>Reviews</TextWrapper>
          </View>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={ImprovementIcon} />
            </View>
            <TextWrapper>Before & After</TextWrapper>
          </View>
        </View>

        {/* Video slider */}
        <View style={{paddingVertical: 16}}>
          <TextWrapper fs={20} fw="700">
            Tips & Tricks
          </TextWrapper>
          <TextWrapper>Tips and tricks every week.</TextWrapper>
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
              <VideoPlayer key={item.id.toString()} uri={item.uri} />
            )}
          />
        </View>

        {/* Worksheets */}
        <Worksheets />

        {/* Video slider */}
        <View style={{paddingVertical: 16}}>
          <TextWrapper fs={20} fw="700">
            Improvements
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
        <View style={{paddingVertical: 16}}>
          <TextWrapper fs={20} fw="700">
            Beautiful Handwriting, Happy Parents
          </TextWrapper>
          <Spacer />
          <FlatList
            data={sliderData}
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
        {/* Reviews */}
        <View style={{paddingVertical: 16}}>
          <Reviews />
        </View>
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
    padding: 16,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    elevation: 1.5,
  },
});
