import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, View, Pressable, ScrollView} from 'react-native';
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
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';

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

import * as Sentry from '@sentry/react-native';

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

const HomeScreen = ({navigation}) => {
  const [childName, setChildName] = useState('');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [cn, setCn] = useState(false);

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
      console.log('marked');
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

    if (isDemoOver && isAttended) {
      setShowPostActions(true);
    } else {
      setShowPostActions(false);
    }
  }, [bookingTime, isAttended]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Update child name if child name not exist or contains your child text
   */
  useEffect(() => {
    if (demoData && bookingDetails) {
      const isCN = !bookingDetails.childName
        .toLowerCase()
        .includes('your child');
      if (isCN) {
        setChildName(bookingDetails.childName);
      }
      setCn(demoData.cN);
    }
  }, [demoData, bookingDetails]);

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
  }, [bookingTime, isTimeover]);

  // show join button to join class
  const SHOW_JOIN_BUTTON = useMemo(() => {
    return isTimeover && showJoinButton;
  }, [isTimeover, showJoinButton]);

  // If there is no child name in booking details
  // then show input field for childname
  // otherwise show text
  const IS_CHILD_NAME = useMemo(() => {
    return !cn ? (
      <>
        <Input
          placeholder="Child Name"
          value={childName}
          onChangeText={onChangeChildName}
        />
        {message && (
          <TextWrapper fs={14} color={COLORS.pred}>
            {message}
          </TextWrapper>
        )}
      </>
    ) : (
      <TextWrapper color={COLORS.black} fs={18} styles={{textAlign: 'left'}}>
        Class is on going, Join now.
      </TextWrapper>
    );
  }, [cn, childName, message]);

  // console.log(showPostActions);

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
        <View style={styles.rightNavButtons}>
          <LanguageSelection />
          <Pressable onPress={handleShowDrawer}>
            <MIcon name="account-circle" size={28} color={COLORS.black} />
          </Pressable>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            {/* Timer */}
            {SHOW_TIMER && <DemoWaiting timeLeft={timeLeft} />}

            {/* Show join button */}
            {SHOW_JOIN_BUTTON && (
              <>
                {IS_CHILD_NAME}
                <Spacer />
                <Button
                  rounded={4}
                  onPress={handleJoinClass}
                  bg={COLORS.pgreen}
                  textColor={COLORS.white}>
                  Enter Class
                </Button>
              </>
            )}
            {isTimeover && !teamUrl && (
              <View
                style={{
                  paddingVertical: 16,
                }}>
                <TextWrapper fs={20}>{localLang.rescheduleText}</TextWrapper>
                <Spacer />
                <Button
                  textColor={COLORS.white}
                  bg={COLORS.pgreen}
                  rounded={6}
                  onPress={rescheduleFreeClass}>
                  {localLang.rescheduleButtonText}
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
