import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  setDemoPhone,
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
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

import {MARK_ATTENDENCE_URL, UPDATE_CHILD_NAME} from '@env';
import Features from '../components/features.component';
import {registerNotificationTimer} from '../natiive-modules/timer-notification';
import {startCallComposite} from '../natiive-modules/team-module';

const INITIAL_TIME = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const ACS_TOKEN_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/msteams/getacstoken';

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

const HomeScreen = ({navigation}) => {
  const [childName, setChildName] = useState('');
  const [bookingTime, setBookingTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [isAttendenceMarked, setIsAttendenceMarked] = useState(false);
  const [isChildName, setIsChildName] = useState(false);
  const [teamUrl, setTeamUrl] = useState(null);

  const dispatch = useDispatch();
  const {demoData, loading, demoPhoneNumber, bookingDetails, demoBookingId} =
    useSelector(joinDemoSelector);

  // Set demo phone number
  useEffect(() => {
    const getPhone = async () => {
      try {
        const phoneFromAsyncStorage = await AsyncStorage.getItem('phone');

        if (phoneFromAsyncStorage) {
          dispatch(setDemoPhone(phoneFromAsyncStorage));
        }
      } catch (error) {
        console.log('Async storage error', error);
      }
    };

    getPhone();
  }, []);

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
          attendedOrNot,
          bookingId: bookingIdFromDemoData,
          teamUrl: meetingLink,
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
                source: 'app',
              }),
            });

            const {message} = await markAttendenceResponse.json();
            console.log(message);

            if (process.env.NODE_ENV !== 'production') {
              ToastAndroid.showWithGravity(
                message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
            if (message === 'Attendance Marked') {
              setIsAttendenceMarked(true);
            }
          }
        }

        if (meetingLink) {
          setTeamUrl(meetingLink);
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
      dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
    }
  }, [demoPhoneNumber, dispatch]);

  // Call api to get booking status from booking id
  useEffect(() => {
    if (demoBookingId) {
      dispatch(startFetchBookingDetailsFromId(demoBookingId));
    }
  }, [demoBookingId, dispatch]);

  useEffect(() => {
    if (isAttendenceMarked) {
      console.log('marked');
      if (demoPhoneNumber) {
        dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
      }

      if (demoBookingId) {
        dispatch(startFetchBookingDetailsFromId(JSON.parse(demoBookingId)));
      }
    }
  }, [isAttendenceMarked]);

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

  // Do not show join button after 50 minutes of demo ended
  useEffect(() => {
    if (bookingTime) {
      const afterHalfHourFromDemoDate =
        new Date(bookingTime).getTime() + 1000 * 60 * 50;

      if (afterHalfHourFromDemoDate <= new Date().getTime()) {
        // Hide class join button
        setShowJoinButton(false);
      }
    }
  }, [bookingTime, demoData]);

  // Notification
  useEffect(() => {
    const setNotification = async () => {
      const classDate = new Date(bookingTime);
      const currentTime = Date.now();

      // If class passed
      if (currentTime > classDate) {
        return;
      }

      const ONE_HOUR = 60 * 60 * 1000;
      const TEN_MINUTES = 10 * 60 * 1000;
      const FIVE_MINUTES = 5 * 60 * 1000;
      const ONE_DAY = 24 * 60 * 60 * 1000;

      const beforeOneHour = classDate.getTime() - ONE_HOUR;
      const beforeTenMinutes = classDate.getTime() - TEN_MINUTES;
      const afterFiveMinutes = classDate.getTime() + FIVE_MINUTES;
      // Set for 11am notification
      const morningNotification = new Date(bookingTime);
      morningNotification.setHours(11);

      const hours = classDate.getHours();
      const body = `Your have a class on ${classDate.toDateString()} at ${
        hours >= 12 ? (hours === 12 ? hours : hours - 12) : hours
      }:00 ${hours >= 12 ? 'pm' : 'am'}.`;

      const morningNotificationBody = `You have a class at ${
        hours >= 12 ? (hours === 12 ? hours : hours - 12) : hours
      }:00 ${hours >= 12 ? 'pm' : 'am'}.`;

      try {
        const isNotification = await AsyncStorage.getItem(
          'countdown_notification',
        );

        // If already set notifications
        if (isNotification) return;

        // Check for today
        if (new Date().getDate() === classDate.getDate()) {
          console.log('all notifications for today');
          if (currentTime < classDate) {
            if (currentTime < beforeTenMinutes) {
              await setCountdownTriggerNotification(
                'countdown',
                'countdown',
                beforeTenMinutes,
                'Your class is about to start in 10 minutes.',
              );
            }
            if (currentTime < beforeOneHour) {
              await setCountdownTriggerNotification(
                'countdown',
                'countdown',
                beforeOneHour,
                'Your class starts in 1 hour. Kindly, join on time.',
              );
            }

            if (new Date().getHours() < 11) {
              await setCountdownTriggerNotification(
                'countdown',
                'countdown',
                morningNotification.getTime(),
                morningNotificationBody,
              );
            }

            await setCountdownTriggerNotification(
              'countdown',
              'countdown',
              afterFiveMinutes,
              'Hurry! your class has already started, join now.',
            );
          }
        } else {
          console.log('set future notifications');
          // Set notifications for future class
          await setCountdownTriggerNotification(
            'countdown',
            'countdown',
            beforeTenMinutes,
            'Your class is about to start in 10 minutes.',
          );
          await setCountdownTriggerNotification(
            'countdown',
            'countdown',
            beforeOneHour,
            'Your class starts in 1 hour. Kindly, join on time.',
          );
          await setCountdownTriggerNotification(
            'countdown',
            'countdown',
            afterFiveMinutes,
            'Hurry! your class has already started, join now.',
          );

          await setCountdownTriggerNotification(
            'countdown',
            'countdown',
            morningNotification.getTime(),
            morningNotificationBody,
          );

          if (new Date().getHours() < 20) {
            const beforeOneDay = new Date(classDate.getTime() - ONE_DAY);
            beforeOneDay.setHours(20);
            await setCountdownTriggerNotification(
              'countdown',
              'countdown',
              beforeOneDay.getTime(),
              body,
            );
          }
        }

        await AsyncStorage.setItem('countdown_notification', 'saved');
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
      new Date(bookingTime).getTime() + 1000 * 60 * 50 <= new Date().getTime();

    if (isDemoOver && isAttended) {
      setShowPostActions(true);
    }
  }, [bookingTime, isAttended]);

  useEffect(() => {
    if (demoData && bookingDetails) {
      const isCN = !bookingDetails.childName
        .toLowerCase()
        .includes('your child');
      if (isCN) {
        setChildName(bookingDetails.childName);
      }
      setIsChildName(demoData.cN);
    }
  }, [demoData, bookingDetails]);

  // show notification timer
  useEffect(() => {
    if (bookingTime) {
      const currentTime = Date.now();

      if (bookingTime > currentTime) {
        registerNotificationTimer(bookingTime);
      }
    }
  }, [bookingTime]);

  // Join Class
  const handleJoinClass = async () => {
    try {
      const notChildName = bookingDetails.childName
        .toLowerCase()
        .includes('your child');
      if (notChildName) {
        await fetch(UPDATE_CHILD_NAME, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bId: bookingDetails.bookingId,
            cN: childName,
          }),
        });
      }

      if (teamUrl) {
        let token = await AsyncStorage.getItem('acsToken');
        const tokenExpireTime = await AsyncStorage.getItem('acsTokenExpire');
        const currentTime = Date.now();

        if (token) {
          const isTokenExpired =
            currentTime > new Date(parseInt(tokenExpireTime)).getTime();

          if (isTokenExpired) {
            const response = await fetch(ACS_TOKEN_URL, {
              method: 'GET',
            });

            const data = await response.json();

            if (data?.token) {
              const expire = data.expireOn;
              if (expire) {
                await AsyncStorage.setItem(
                  'acsTokenExpire',
                  new Date(expire).getTime().toString(),
                );
              }
              await AsyncStorage.setItem('acsToken', data.token);
              token = data.token;
            }
          }
        } else {
          const response = await fetch(ACS_TOKEN_URL, {
            method: 'GET',
          });

          const data = await response.json();

          if (data?.token) {
            const expire = data.expireOn;
            if (expire) {
              await AsyncStorage.setItem(
                'acsTokenExpire',
                new Date(expire).getTime().toString(),
              );
            }
            await AsyncStorage.setItem('acsToken', data.token);
            token = data.token;
          }
        }

        startCallComposite(childName, teamUrl, token);
      }
    } catch (error) {
      console.log('Join class error', error);
    }
  };

  // show drawer
  const handleShowDrawer = () => navigation.openDrawer();

  const rescheduleFreeClass = () => {
    const {childAge, parentName, phone, childName} = bookingDetails;
    const formFields = {childAge, parentName, phone, childName};

    navigation.navigate('BookDemoSlots', {formFields});
  };

  return loading ? (
    <Center bg={COLORS.white}>
      <Spinner />
    </Center>
  ) : (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TextWrapper
          fs={18}
          color={COLORS.black}
          styles={{textTransform: 'capitalize'}}>
          English handwriting
        </TextWrapper>
        <Pressable onPress={handleShowDrawer}>
          <MIcon name="account-circle" size={28} color={COLORS.black} />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.container}>
          <View style={{width: '100%', maxWidth: 428, alignSelf: 'center'}}>
            {bookingTime
              ? new Date(bookingTime).getTime() > new Date().getTime() && (
                  <DemoWaiting timeLeft={timeLeft} />
                )
              : null}
            {isTimeover
              ? showJoinButton && (
                  <>
                    {!isChildName ? (
                      <Input
                        placeholder="Child Name"
                        value={childName}
                        onChangeText={e => setChildName(e)}
                      />
                    ) : (
                      <TextWrapper
                        color={COLORS.black}
                        fs={18}
                        styles={{textAlign: 'left'}}>
                        Class is on going, Join now.
                      </TextWrapper>
                    )}
                    <Spacer />
                    <Button
                      rounded={4}
                      onPress={handleJoinClass}
                      bg={COLORS.pgreen}
                      textColor={COLORS.white}>
                      Enter Class
                    </Button>
                  </>
                )
              : null}
            {bookingTime &&
              new Date(bookingTime).getTime() <= new Date().getTime() &&
              !teamUrl && (
                <View
                  style={{
                    paddingVertical: 16,
                  }}>
                  <TextWrapper fs={20}>
                    Looks like you missed the class, please reschedule one
                  </TextWrapper>
                  <Spacer />
                  <Button
                    textColor={COLORS.white}
                    bg={COLORS.pgreen}
                    rounded={6}
                    onPress={rescheduleFreeClass}>
                    Reschedule
                  </Button>
                </View>
              )}
            {
              // If user attended demo class
              // Demo has ended
              // Show post action after demo class
              showPostActions ? (
                <PostDemoAction />
              ) : (
                <Features demoData={demoData} />
              )
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
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
});
