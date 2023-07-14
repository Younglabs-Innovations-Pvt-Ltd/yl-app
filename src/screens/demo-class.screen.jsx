import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import CountDown from '../components/countdown.component';
import Spacer from '../components/spacer.component';
import Button from '../components/button.component';
import {joinClassOnZoom} from '../natiive-modules/zoom-modules';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/input.component';
import JoinDemo from '../components/join-demo.component';
import Seperator from '../components/seperator.component';

import {COLORS} from '../theme/theme';

import {useSelector, useDispatch} from 'react-redux';
import {
  startFetchBookingDetailsFromId,
  startFetchBookingDetailsFromPhone,
} from '../store/demo/demo.reducer';

const MARK_ATTENDENCE_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/markattendance';

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

const INITIAL_TIME = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

// Main Component
const DemoClassScreen = ({route, navigation}) => {
  const {
    params: {
      data: {queryData},
    },
  } = route;

  const dispatch = useDispatch();
  const {demoData, loading} = useSelector(state => state.demo);

  const [childName, setChildName] = useState('');
  const [bookingTime, setBookingTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [zoomData, setZoomData] = useState(null);
  const [demoBookingId, setDemoBookingId] = useState('');
  const [demoPhoneNumber, setDemoPhoneNumber] = useState('');
  const [showJoinButton, setShowJoinButton] = useState(false);

  // Set demo booking id
  useEffect(() => {
    const getDemoId = async () => {
      try {
        const demoIdFromAsyncStorage = await AsyncStorage.getItem('bookingid');
        const phoneFromAsyncStorage = await AsyncStorage.getItem('phone');

        if (queryData && !demoIdFromAsyncStorage) {
          await AsyncStorage.setItem('bookingid', queryData?.demoId);
        }

        const demoId = demoIdFromAsyncStorage || queryData?.demoId;

        if (phoneFromAsyncStorage) {
          setDemoPhoneNumber(phoneFromAsyncStorage);
        } else {
          setDemoBookingId(demoId);
        }
      } catch (error) {
        console.log('Async storage error', error);
      }
    };

    getDemoId();
  }, []);

  // set demo data
  useEffect(() => {
    const setDemoData = async () => {
      // If data not found
      if (demoData.hasOwnProperty('message')) return;
      try {
        const {
          demoDate: {_seconds},
          meetingId,
          pwd,
          attendedOrNot,
        } = demoData;

        const demodate = new Date(_seconds * 1000).getDate();
        const today = new Date().getDate();

        // Mark attendence
        if (demodate === today) {
          if (!attendedOrNot) {
            const markAttendenceResponse = await fetch(MARK_ATTENDENCE_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'student',
                bId: JSON.parse(demoBookingId),
              }),
            });

            if (markAttendenceResponse.status === 200) {
              console.log(await markAttendenceResponse.json());
            }
          }
        }

        // If marked attendence, set zoom data(meetingId, password)
        if (meetingId && pwd) {
          console.log('Got zoom data successfully.', {meetingId, pwd});
          setZoomData({meetingId, pwd});
          setShowJoinButton(true);
        }

        // Set booking time for timer
        if (_seconds) setBookingTime(_seconds * 1000);
      } catch (error) {
        console.log('setDemoData_error', error);
      }
    };

    if (demoData) {
      setDemoData();
    }
  }, [demoData]);

  useEffect(() => {
    if (demoData) {
      if (demoData.hasOwnProperty('message')) {
        ToastAndroid.showWithGravity(
          'Wrong number',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    }
  }, [demoData]);

  // Call api to get booking status from booking id
  useEffect(() => {
    if (demoBookingId) {
      dispatch(startFetchBookingDetailsFromId(demoBookingId));
    }
  }, [demoBookingId]);

  // Call api to get booking status from phone number
  useEffect(() => {
    if (demoPhoneNumber) {
      dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
    }
  }, [demoPhoneNumber]);

  // Timer
  useEffect(() => {
    let apiCount = 0;
    let timer;

    if (bookingTime) {
      timer = setInterval(() => {
        const remaining = getTimeRemaining(bookingTime);
        if (remaining.remainingTime <= 0) {
          setIsTimeover(true);
          clearInterval(timer);
          return;
        }

        if (apiCount < 1) apiCount++;

        if (remaining.remainingTime <= 120 * 1000) {
          if (apiCount === 1) {
            console.log('2 minutes is left to call api');
            // if (demoBookingId) {
            //   getBookingStatus({bId: JSON.parse(demoBookingId)});
            // }
            apiCount++;
          }
        }

        // set time to show
        setTimeLeft(remaining);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [bookingTime]);

  useEffect(() => {
    if (bookingTime) {
      const afterOneHourFromDemoDate =
        new Date(bookingTime).getTime() + 1000 * 60 * 60;

      if (afterOneHourFromDemoDate <= new Date().getTime()) {
        console.log('time over');
        // Hide class join button
        setShowJoinButton(false);
      }
    }
  }, [bookingTime]);

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
    } catch (error) {
      console.log('Join class error', error);
    }
  };

  const handleBookingStatus = async phone => {
    dispatch(startFetchBookingDetailsFromPhone(phone));
    setDemoPhoneNumber(phone);
  };

  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.box}>
            {/* <Text style={styles.heading}>Welcome to YoungLabs</Text> */}
            {bookingTime
              ? new Date(bookingTime).getTime() > new Date().getTime() && (
                  <DateTime demoDate={bookingTime} />
                )
              : null}
            <Spacer space={6} />
            {bookingTime ? (
              new Date(bookingTime).getTime() > new Date().getTime() ? (
                <CountDown timeLeft={timeLeft} />
              ) : (
                <View>
                  <Text>How was your demo?</Text>
                </View>
              )
            ) : null}
            <Spacer />
            {isTimeover
              ? showJoinButton && (
                  <>
                    <Input
                      placeholder="Child Name"
                      selectionColor="#000"
                      style={styles.input}
                      value={childName}
                      onChangeText={e => setChildName(e)}
                    />
                    <Spacer />
                    <Button onPress={handleJoinClass} bg={COLORS.pgreen}>
                      Join Class
                    </Button>
                  </>
                )
              : null}
            {!demoBookingId && !demoPhoneNumber ? (
              <>
                <JoinDemo handleBookingStatus={handleBookingStatus} />
                <Spacer space={4} />
                <Seperator text="or" />
                <Spacer space={4} />
                <Button bg={'#F86F03'} onPress={() => console.log('pressed!')}>
                  Book A Free Demo
                </Button>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DemoClassScreen;

const DateTime = ({demoDate}) => {
  const localDate = new Date(demoDate).toDateString();
  return (
    <Text
      style={{
        ...styles.textCenter,
        ...styles.demoDateText,
      }}>
      Your demo class is at{' '}
      <Text style={{color: '#000', fontWeight: '700'}}>{localDate}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  logo: {
    maxWidth: '100%',
    height: 110,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  box: {
    maxWidth: 540,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  textCenter: {
    textAlign: 'center',
  },
  demoDateText: {
    fontSize: 18,
    color: 'gray',
  },
});
