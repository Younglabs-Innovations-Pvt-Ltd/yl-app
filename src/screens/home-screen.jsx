import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  setDemoPhone,
  startFetchBookingDetailsFromPhone,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {
  joinClassOnZoom,
  classStatusChangeListener,
} from '../natiive-modules/zoom-modules';
import {fetchBookingDetailsFromPhone} from '../utils/api/yl.api';
import {setCountdownTriggerNotification} from '../utils/notifications';

import Input from '../components/input.component';
import Button from '../components/button.component';
import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import DemoWaiting from '../components/join-demo-class-screen/demo-waiting.component';
import PostDemoAction from '../components/join-demo-class-screen/post-demo-actions.component';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../assets/theme/theme';
import TextWrapper from '../components/text-wrapper.component';
import Center from '../components/center.component';

const MARK_ATTENDENCE_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/markattendance';

const INITIAL_TIME = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const getTimeRemaining = bookingDate => {
  const countDownTime = new Date(bookingDate).getTime();
  const now = new Date().getTime();

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

const {height: windowHeight} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const [childName, setChildName] = useState('');
  const [bookingTime, setBookingTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [zoomData, setZoomData] = useState(null);
  const [showJoinButton, setShowJoinButton] = useState(false);
  // const [shouldShowJoin, setShouldShowJoin] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);

  const dispatch = useDispatch();
  const {demoData, loading, demoPhoneNumber} = useSelector(joinDemoSelector);

  // class status callback
  const handleClassStatusCallback = async () => {
    try {
      const phone = await AsyncStorage.getItem('phone');
      const reponse = await fetchBookingDetailsFromPhone(phone);
      const {
        demoDate: {_seconds},
      } = await reponse.json();
      setBookingTime(_seconds * 1000);
    } catch (error) {
      console.log(error);
    }
  };

  // Class status callback listener
  useEffect(() => {
    classStatusChangeListener(handleClassStatusCallback);
  }, []);

  // Set demo booking id or phone number
  useEffect(() => {
    const getDemoId = async () => {
      try {
        const phoneFromAsyncStorage = await AsyncStorage.getItem('phone');

        if (phoneFromAsyncStorage) {
          dispatch(setDemoPhone(phoneFromAsyncStorage));
        }
      } catch (error) {
        console.log('Async storage error', error);
      }
    };

    getDemoId();
  }, [dispatch]);

  // set demo data
  useEffect(() => {
    const setDemoData = async () => {
      // If user put wrong number
      if (demoData.hasOwnProperty('message')) {
        return;
      }
      try {
        const {
          demoDate: {_seconds},
          meetingId,
          pwd,
          attendedOrNot,
          bookingId: bookingIdFromDemoData,
        } = demoData;

        const demodate = new Date(_seconds * 1000);
        const today = new Date().getDate();

        // Mark attendence
        if (demodate.getDate() === today) {
          if (!attendedOrNot) {
            const markAttendenceResponse = await fetch(MARK_ATTENDENCE_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'student',
                bId: bookingIdFromDemoData,
              }),
            });

            const markAttendenceData = await markAttendenceResponse.json();

            console.log(markAttendenceData);
          }
        }

        // If marked attendence, set zoom data(meetingId, password)
        if (meetingId && pwd) {
          console.log('Got zoom data successfully.', {meetingId, pwd});
          setZoomData({meetingId, pwd});
          setShowJoinButton(true);
          setIsAttended(attendedOrNot);
        }

        // Set booking time for timer
        if (_seconds) setBookingTime(_seconds * 1000 + 1000 * 60);
      } catch (error) {
        console.log('setDemoData_error', error);
      }
    };

    if (demoData) {
      setDemoData();
    }
  }, [demoData]);

  // Call api to get booking status from phone number
  useEffect(() => {
    if (demoPhoneNumber) {
      !demoData && dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
    }
  }, [demoPhoneNumber, dispatch, demoData]);

  // Timer
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

  // Do not show join button after 1 hour of demo ended
  useEffect(() => {
    if (bookingTime) {
      const afterHalfHourFromDemoDate =
        new Date(bookingTime).getTime() + 1000 * 60 * 30;

      if (afterHalfHourFromDemoDate <= new Date().getTime()) {
        // Hide class join button
        setShowJoinButton(false);
      }
    }
  }, [bookingTime]);

  // Notification
  useEffect(() => {
    const setNotification = async () => {
      try {
        const isNotification = await AsyncStorage.getItem(
          'countdown_notification',
        );

        const checkDate =
          new Date().getDate() <= new Date(bookingTime).getDate();
        if (!checkDate) return;

        if (!isNotification) {
          // before 1 hour from demo class
          const notificationTime =
            new Date(bookingTime).getTime() - 1000 * 60 * 60;

          // for 11 am
          const time = new Date(bookingTime);
          time.setHours(11);

          const hours = new Date(bookingTime).getHours();
          const body = `Your free class will be started at ${
            hours >= 12 ? (hours === 12 ? hours : hours - 12) : hours
          } : 00 ${hours >= 12 ? 'pm' : 'am'}.`;

          await setCountdownTriggerNotification(
            'countdown',
            'countdown',
            time.getTime(),
            body,
          );
          await setCountdownTriggerNotification(
            'countdown',
            'countdown',
            notificationTime,
            body,
          );

          await AsyncStorage.setItem('countdown_notification', 'saved');
        }
      } catch (error) {
        console.log('notification error', error);
      }
    };

    if (bookingTime) {
      setNotification();
    }
  }, [bookingTime]);

  // Post Actions
  useEffect(() => {
    if (!bookingTime) return;

    const isDemoOver =
      new Date(bookingTime).getTime() + 1000 * 60 * 30 <= new Date().getTime();

    if (isDemoOver && isAttended) {
      setShowPostActions(true);
    }
  }, [bookingTime, isAttended]);

  // Join Class
  const handleJoinClass = async () => {
    if (!zoomData || !childName) {
      console.log('No class data found');
      return;
    }

    try {
      const {meetingId, pwd} = zoomData;
      const res = await joinClassOnZoom(JSON.stringify(meetingId), pwd);
      console.log('Join Class', res);
      // if (res === 'class joined.') {
      //   if (new Date(bookingTime).getTime() <= new Date().getTime()) {
      //     demoData.attendedOrNot && setIsAttended(true);
      //   }
      // }
    } catch (error) {
      console.log('Join class error', error);
    }
  };

  // show drawer
  const handleShowDrawer = () => navigation.openDrawer();

  return loading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <>
      <View>
        <View style={styles.header}>
          <TextWrapper color={COLORS.black}>Welcome</TextWrapper>
          <Pressable onPress={handleShowDrawer}>
            <MIcon name="account-circle" size={28} color={COLORS.black} />
          </Pressable>
        </View>
        <View style={styles.container}>
          {bookingTime
            ? new Date(bookingTime).getTime() > new Date().getTime() && (
                <DemoWaiting
                  timeLeft={timeLeft}
                  // handleBackButton={handleBackButton}
                />
              )
            : null}
          {isTimeover
            ? showJoinButton && (
                <>
                  <Input
                    placeholder="Child Name"
                    value={childName}
                    onChangeText={e => setChildName(e)}
                  />
                  <Spacer />
                  <Button
                    rounded={4}
                    onPress={handleJoinClass}
                    bg={COLORS.pgreen}
                    textColor={COLORS.white}>
                    Join Class
                  </Button>
                </>
              )
            : null}
          {
            // If user attended demo class
            // Demo has ended
            // Show post action after demo class
            showPostActions && <PostDemoAction />
          }
        </View>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.white,
  },
});
