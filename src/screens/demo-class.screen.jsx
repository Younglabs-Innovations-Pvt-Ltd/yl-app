import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import CountDown from '../components/countdown.component';
import Seperator from '../components/seperator.component';
import Button from '../components/button.component';
import {joinClassOnZoom} from '../natiive-modules/zoom-modules';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/input.component';

const BOOKING_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/bookingstatus';

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

  const [childName, setChildName] = useState('');
  const [bookingTime, setBookingTime] = useState('2023-07-12T09:30:00.000Z');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [zoomData, setZoomData] = useState(null);
  const [demoBookingId, setDemoBookingId] = useState('');
  const [showJoinButton, setShowJoinButton] = useState(false);

  // Set demo booking id
  useEffect(() => {
    const getDemoId = async () => {
      try {
        const demoIdFromAsyncStorage = await AsyncStorage.getItem('bookingid');

        if (queryData && !demoIdFromAsyncStorage) {
          await AsyncStorage.setItem('bookingid', queryData?.demoId);
        }

        const demoId = demoIdFromAsyncStorage || queryData?.demoId;

        if (demoId) setDemoBookingId(demoId);
      } catch (error) {
        console.log('Async storage error', error);
      }
    };

    getDemoId();
  }, []);

  // Call api to get booking status
  useEffect(() => {
    const getBookingStatus = async () => {
      try {
        const response = await fetch(BOOKING_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({bId: JSON.parse(demoBookingId)}),
        });

        const {
          demoDate: {_seconds},
          meetingId,
          pwd,
          attendedOrNot,
        } = await response.json();

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
        console.log('Demo Class, booking status api error', error);
      }
    };

    if (demoBookingId) {
      getBookingStatus();
    }
  }, [demoBookingId]);

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

  // const handleDemoId = async id => {
  //   console.log('id', id);

  //   try {
  //     const data = await fetch(BOOKING_URL, {
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //       body: JSON.stringify({bId: id}),
  //     }).then(response => response.json());

  //     console.log(data);
  //   } catch (error) {
  //     console.log('Demo Class, booking status api error', error);
  //   }
  // };

  return (
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
            <Seperator space={6} />
            {<CountDown timeLeft={timeLeft} />}
            <Seperator />
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
                    <Seperator />
                    <Button onPress={handleJoinClass} bg="#3CCF4E">
                      Join Class
                    </Button>
                  </>
                )
              : null}
            <Seperator />
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
    paddingTop: 36,
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
