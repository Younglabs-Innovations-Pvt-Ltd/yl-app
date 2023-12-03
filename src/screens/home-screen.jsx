import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Alert,
  StatusBar,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
  setPhoneAsync,
  setDemoData,
  setDemoNotifications,
  joinFreeClass,
  setShowJoinButton,
} from '../store/join-demo/join-demo.reducer';
import {resetCurrentNetworkState} from '../store/network/reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {networkSelector} from '../store/network/selector';

import Input from '../components/input.component';
import Button from '../components/button.component';
import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import DemoWaiting from '../components/join-demo-class-screen/demo-waiting.component';
import PostDemoAction from '../components/join-demo-class-screen/post-demo-actions.component';

import {COLORS} from '../utils/constants/colors';
import TextWrapper from '../components/text-wrapper.component';
import Center from '../components/center.component';

import Features from '../components/features.component';
import {registerNotificationTimer} from '../natiive-modules/timer-notification';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

import {i18nContext} from '../context/lang.context';
import LanguageSelection from '../components/language-selection.component';
import NetInfo from '@react-native-community/netinfo';

import Icon from '../components/icon.component';
import DocumentPicker, {types} from 'react-native-document-picker';

import Storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../utils/constants/local-keys';

import Demo from '../components/demo.component';

import * as Sentry from '@sentry/react-native';
import Reviews from '../components/reviews.component';

import Worksheets from '../components/worksheets.component';
import VideoPlayer from '../components/video.component';
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

const image1 =
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D';
const image2 =
  'https://media.istockphoto.com/id/1410336911/photo/back-view-of-little-girl-attending-a-class-in-elementary-school.webp?b=1&s=170667a&w=0&k=20&c=ZX4SkJF68Ohe3dV2fxZQgKhf8fud1lnpxXWamS1EwFc=';
const image3 =
  'https://media.istockphoto.com/id/1402788196/photo/smiling-teacher-and-little-child-talking-and-playing-at-preschool.webp?b=1&s=170667a&w=0&k=20&c=8lvYGQ1mv6p4rfS3uoPkj6O_GDlGeFnhDzYzWe3x6ck=';

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

const HomeScreen = ({navigation}) => {
  const [childName, setChildName] = useState('');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {localLang} = i18nContext();

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
    showJoinButton,
    message,
  } = useSelector(joinDemoSelector);

  // console.log('demo', demoData);

  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);

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
  useEffect(() => {
    if (bookingTime) {
      dispatch(setDemoNotifications({bookingTime}));
    }
  }, [bookingTime]);

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

  // on change for child name
  const onChangeChildName = e => {
    setChildName(e);
  };

  // Join Class
  const handleJoinClass = async () => {
    dispatch(joinFreeClass({bookingDetails, childName, teamUrl}));
  };

  // show drawer
  const handleShowDrawer = () => navigation.openDrawer();

  // Reschedule a class
  const rescheduleFreeClass = () => {
    const {childAge, parentName, phone, childName} = bookingDetails;
    const formFields = {childAge, parentName, phone, childName};

    navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  };

  // UI Constants
  // show countdown timer
  const SHOW_TIMER = useMemo(() => {
    if (!bookingTime) return null;

    return new Date(bookingTime).getTime() > Date.now();
  }, [bookingTime]);

  // show join button to join class
  const SHOW_JOIN_BUTTON = useMemo(() => {
    return isTimeover && showJoinButton;
  }, [isTimeover, showJoinButton]);

  // If there is no child name in booking details
  // then show input field for childname
  // otherwise show text
  // const IS_CHILD_NAME = useMemo(() => {
  //   return !cn ? (
  //     <>
  //       <Input
  //         placeholder="Child Name"
  //         value={childName}
  //         onChangeText={onChangeChildName}
  //       />
  //       {message && (
  //         <TextWrapper fs={14} color={COLORS.pred}>
  //           {message}
  //         </TextWrapper>
  //       )}
  //     </>
  //   ) : (
  //     <TextWrapper color={COLORS.black} fs={18} styles={{textAlign: 'left'}}>
  //       Class is on going, Join now.
  //     </TextWrapper>
  //   );
  // }, [cn, childName, message]);

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

  // return loading ? (
  //   <Center bg={COLORS.white}>
  //     <Spinner />
  //   </Center>
  // ) : (
  //   <View style={{flex: 1}}>
  //     <View style={styles.header}>
  //       <TextWrapper
  //         fs={18}
  //         color={COLORS.black}
  //         styles={{textTransform: 'capitalize'}}>
  //         English handwriting
  //       </TextWrapper>
  //       <View style={styles.rightNavButtons}>
  //         {/* <LanguageSelection /> */}
  //         <Pressable onPress={handleShowDrawer}>
  //           <MIcon name="account-circle" size={28} color={COLORS.black} />
  //         </Pressable>
  //       </View>
  //     </View>
  //     <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
  //       <View style={styles.container}>
  //         <View style={styles.contentWrapper}>
  //           {/* Timer */}
  //           {SHOW_TIMER && <DemoWaiting timeLeft={timeLeft} />}

  //           {/* Show join button */}
  //           {SHOW_JOIN_BUTTON && (
  //             <>
  //               {IS_CHILD_NAME}
  //               <Spacer />
  //               <Button
  //                 rounded={4}
  //                 onPress={handleJoinClass}
  //                 bg={COLORS.pgreen}
  //                 textColor={COLORS.white}>
  //                 Enter Class
  //               </Button>
  //             </>
  //           )}
  //           {isTimeover && !teamUrl && (
  //             <View
  //               style={{
  //                 paddingVertical: 16,
  //               }}>
  //               <TextWrapper fs={20}>{localLang.rescheduleText}</TextWrapper>
  //               <Spacer />
  //               <Button
  //                 textColor={COLORS.white}
  //                 bg={COLORS.pgreen}
  //                 rounded={6}
  //                 onPress={rescheduleFreeClass}>
  //                 {localLang.rescheduleButtonText}
  //               </Button>
  //             </View>
  //           )}
  //           {
  //             // If user attended demo class
  //             // Demo has ended
  //             // Show post action after demo class
  //             showPostActions ? (
  //               <PostDemoAction />
  //             ) : (
  //               <Features demoData={demoData} />
  //             )
  //           }
  //         </View>
  //       </View>
  //     </ScrollView>
  //   </View>
  // );
  const [isPlaying, setPlaying] = useState(false);

  const playPauseVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!isPlaying);
    }
  };

  // const pauseVideo = () => {
  //   if (videoRef.current) {
  //     console.log(videoRef.current.pause());
  //   }
  // };

  // const onReadyForDisplay = () => {
  //   console.log('ready for display');
  // }

  const {token} = useSelector(authSelector);

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TextWrapper
          fs={18}
          color={COLORS.black}
          styles={{textTransform: 'capitalize'}}>
          English handwriting
        </TextWrapper>
        <View style={styles.rightNavButtons}>
          {/* <LanguageSelection /> */}
          <Pressable onPress={handleShowDrawer}>
            <MIcon name="account-circle" size={28} color={COLORS.black} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bouncesZoom={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 8,
          paddingBottom: StatusBar.currentHeight * 0.6,
        }}>
        {loading ? (
          <Spinner style={{alignSelf: 'center'}} />
        ) : (
          <Demo
            isTimeover={isTimeover}
            timeLeft={timeLeft}
            showPostActions={showPostActions}
          />
        )}
        {/* Top Banner */}
        <View style={{flexDirection: 'row', marginVertical: 12}}>
          <View
            style={{width: '75%', padding: 8, backgroundColor: COLORS.orange}}>
            <TextWrapper>
              Get a custom handwriting improvement plan worth Rs.500
            </TextWrapper>
          </View>
          <View
            style={{width: '25%', padding: 8, backgroundColor: COLORS.pgreen}}>
            <TextWrapper>Send a photo of handwriting</TextWrapper>
          </View>
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
          {/* <TextWrapper
            fs={18}
            styles={{textAlign: 'center', marginVertical: 12}}>
            {sliderData[0].text}
          </TextWrapper> */}
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
          {/* <TextWrapper
            fs={18}
            styles={{textAlign: 'center', marginVertical: 12}}>
            {sliderData[0].text}
          </TextWrapper> */}
        </View>

        {/* Upload Image */}
        {/* <View style={{maxWidth: 378, alignSelf: 'center'}}>
          <View>
            <TextWrapper fs={18}>
              Take picture of your child's english handwriting and upload.
            </TextWrapper>
            <Pressable
              style={({pressed}) => [
                styles.cameraView,
                {
                  opacity: pressed ? 0.8 : 1,
                  justifyContent: selectedImage ? 'flex-start' : 'center',
                },
              ]}
              onPress={pickFile}>
              {!selectedImage ? (
                <Icon
                  name="camera"
                  size={64}
                  color={COLORS.black}
                  style={{alignSelf: 'center'}}
                />
              ) : (
                <Image
                  style={styles.hImage}
                  source={{uri: selectedImage?.uri}}
                />
              )}

              {selectedImage && (
                <Pressable style={styles.btnClose} onPress={closeImage}>
                  <Icon name="close-outline" size={28} color={COLORS.black} />
                </Pressable>
              )}

              {selectedImage && (
                <Pressable
                  style={styles.btnUpload}
                  onPress={uploadHandwritingImage}>
                  <Icon
                    name="cloud-upload-outline"
                    size={24}
                    color={COLORS.black}
                  />
                  <TextWrapper>Upload</TextWrapper>
                </Pressable>
              )}
            </Pressable>
          </View>
        </View> */}

        {/* Feature Section*/}
        {/* <View style={styles.improvements}>
          <View style={styles.improvementItem}>
            <TextWrapper fs={24}>Heading 1</TextWrapper>
            <Spacer space={4} />
            <TextWrapper>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quis
              veniam expedita minus, animi dolorem eveniet deserunt totam
              similique, reiciendis at? Officiis voluptatum tempore tempora
              alias perferendis ducimus odio eos!
            </TextWrapper>
            <Spacer space={8} />
            <Image
              style={{width: '100%', height: 200, borderRadius: 4}}
              source={{uri: image1}}
            />
          </View>
          <View style={styles.improvementItem}>
            <TextWrapper fs={24}>Heading 2</TextWrapper>
            <Spacer space={4} />
            <TextWrapper>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quis
              veniam expedita minus, animi dolorem eveniet deserunt totam
              similique, reiciendis at? Officiis voluptatum tempore tempora
              alias perferendis ducimus odio eos!
            </TextWrapper>
            <Spacer space={8} />
            <Image
              style={{width: '100%', height: 200, borderRadius: 4}}
              source={{uri: image2}}
            />
          </View>
          <View style={styles.improvementItem}>
            <TextWrapper fs={24}>Heading 3</TextWrapper>
            <Spacer space={4} />
            <TextWrapper>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quis
              veniam expedita minus, animi dolorem eveniet deserunt totam
              similique, reiciendis at? Officiis voluptatum tempore tempora
              alias perferendis ducimus odio eos!
            </TextWrapper>
            <Spacer space={8} />
            <Image
              style={{width: '100%', height: 200, borderRadius: 4}}
              source={{uri: image3}}
            />
          </View>
        </View> */}

        {/* <View style={styles.worksheetContainer}>
            <TextWrapper fs={22}>Worksheets</TextWrapper>
            <TextWrapper>
              Download worksheets for practice before the class.
            </TextWrapper>
            <View style={styles.worksheets}>
              <View style={styles.worksheet}></View>
            </View>
          </View> */}
        {/* Reviews */}
        <View style={{paddingVertical: 16}}>
          <Reviews />
        </View>

        {/* Improvements */}
        <View style={{}}>
          {/* <Image
            source={require('../assets/test.jpeg')}
            style={{width: '100%', aspectRatio: 3 / 2}}
            resizeMethod="scale"
            resizeMode="cover"
          />
          <Image
            source={require('../assets/test1.jpeg')}
            style={{width: '100%', aspectRatio: 3 / 2}}
            resizeMethod="scale"
            resizeMode="cover"
          />
          <Image
            source={require('../assets/test2.jpeg')}
            style={{width: '100%', aspectRatio: 3 / 2}}
            resizeMethod="scale"
            resizeMode="cover"
          />
          <Image
            source={require('../assets/test3.jpeg')}
            style={{width: '100%', aspectRatio: 3 / 2}}
            resizeMethod="scale"
            resizeMode="cover"
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 540,
    alignSelf: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.white,
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
});
