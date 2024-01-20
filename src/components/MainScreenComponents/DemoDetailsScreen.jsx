import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {joinDemoSelector} from '../../store/join-demo/join-demo.selector';
import {setDemoData} from '../../store/join-demo/join-demo.reducer';
import DemoWaiting from '../join-demo-class-screen/demo-waiting.component';

const DemoDetailsScreen = ({navigation, phone}) => {
  const {textColors, colorYlMain} = useSelector(state => state.appTheme);
  const {bookingDetails, bookingTime, demoData} = useSelector(joinDemoSelector);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeover, setIsTimeover] = useState(false);
  const dispatch = useDispatch();

  //   console.log('Booking Time is', bookingTime, demoData);
  // console.log("Time left is", timeLeft);

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

  //   useEffect(() => {
  //     if (bookingDetails?.indiaDemoDate) {
  //     }
  //   });

  useEffect(() => {
    if (demoData) {
      dispatch(setDemoData({demoData, phone}));
    }
  }, [demoData]);

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

        // if (new Date(bookingTime).getTime() - 1000 <= new Date().getTime()) {
        //   dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
        // }

        // set time to show
        setTimeLeft(remaining);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [bookingTime]);

  // console.log("booking Details" , bookingDetails);
  

  return (
    <View className="w-[95%]">
      {timeLeft && !isTimeover && <DemoWaiting timeLeft={timeLeft} />}
    </View>
  );
};

export default DemoDetailsScreen;
