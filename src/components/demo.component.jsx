import React, {useMemo, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
} from 'react-native';
import DemoWaiting from './join-demo-class-screen/demo-waiting.component';
import TextWrapper from './text-wrapper.component';
import PostDemoAction from './join-demo-class-screen/post-demo-actions.component';
import {COLORS} from '../utils/constants/colors';

import {useDispatch, useSelector} from 'react-redux';
import {
  joinFreeClass,
  setJoinClassErrorMsg,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {FONTS} from '../utils/constants/fonts';
import moment from 'moment';
import {TextInput} from 'react-native-gesture-handler';
import CourseDetails from '../screens/course-details.screen';

const Demo = ({timeLeft, showPostActions, rescheduleClass}) => {
  const [childName, setChildName] = useState('');
  const [cn, setCn] = useState(false);

  const dispatch = useDispatch();
  const {textColors} = useSelector(state => state.appTheme);

  const {
    demoData,
    bookingDetails,
    bookingTime,
    message,
    isClassOngoing,
    joinClassLoading,
    joinClassErrorMsg,
    teamUrl,
    isAttended,
  } = useSelector(joinDemoSelector);

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

  useEffect(() => {
    if (joinClassErrorMsg) {
      Alert.alert('Something went wrong', 'Can not join class', [
        {
          text: 'Retry',
          onPress: () => {
            dispatch(setJoinClassErrorMsg(''));
            handleJoinClass();
          },
        },
        {
          text: 'Cancel',
          onPress: () => dispatch(setJoinClassErrorMsg('')),
        },
      ]);
    }
  }, [joinClassErrorMsg]);

  // on change for child name
  const onChangeChildName = e => {
    setChildName(e);
  };

  // Join Class
  const handleJoinClass = async () => {
    // console.log("first");
    dispatch(
      joinFreeClass({bookingDetails, childName, demoData, loading: true}),
    );
  };

  //   UI Constants
  // show countdown timer
  const SHOW_TIMER = useMemo(() => {
    if (!bookingTime) return null;

    return new Date(bookingTime).getTime() > Date.now();
  }, [bookingTime]);

  // If there is no child name in booking details
  // then show input field for childname
  // otherwise show text

  const IS_CHILD_NAME = useMemo(() => {
    return !cn ? (
      <>
        <View className="w-full flex-row items-end mb-3">
          <Text className="text-white font-semibold text-base">
            Your Child Name
          </Text>
          <View className="flex-1 px-3">
            <TextInput
              placeholder="Child Name"
              value={childName}
              onChangeText={onChangeChildName}
              className="text-white border-b border-white p-1 text-base w-full"
            />
          </View>
        </View>
        {message && (
          <TextWrapper fs={14} color={COLORS.pred}>
            {message}
          </TextWrapper>
        )}
      </>
    ) : (
      ''
    );
  }, [cn, childName, message]);

  // If demo is over and user didn't join
  const SHOW_RESCHEDULE = useMemo(() => {
    if (!bookingTime) {
      return null;
    }

    if (moment().isAfter(moment(bookingTime).add(50, 'minutes')) && !teamUrl) {
      return (
        <View
          style={{
            flexDirection: 'row',
            padding: 4,
            // justifyContent: 'space-between',
          }}>
          <TextWrapper
            color={COLORS.white}
            ff={FONTS.primaryFont}
            fs={15}
            styles={{flex: 1}}>
            You missed your free class
          </TextWrapper>
          <Pressable
            style={({pressed}) => [
              styles.paButton,
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={rescheduleClass}>
            <TextWrapper color={'#434a52'} fs={12} ff={FONTS.primaryFont}>
              Reschedule
            </TextWrapper>
          </Pressable>
        </View>
      );
    }
  }, [teamUrl, bookingTime, isAttended, rescheduleClass]);

  const courseName = bookingDetails?.courseName || ""

  return (
    <ScrollView
      style={styles.contentWrapper}
      showsVerticalScrollIndicator={false}>
      {/* {NEW_BOOKING} */}
      {/* Timer */}
      {SHOW_TIMER && !isClassOngoing && <DemoWaiting timeLeft={timeLeft} />}
      {/* Show join button */}
      {isClassOngoing && (
        <View style={{paddingHorizontal: 2, paddingVertical: 6}}>
          {IS_CHILD_NAME}
          <View className="w-full p-1 px-3">
            <Text
              className="text-white font-semibold text-base ml-3"
              style={{fontFamily: FONTS.primaryFont}}>
              Your first free {courseName} class is live
            </Text>
            <View className="w-full">
              <Pressable
                className="py-1 w-full rounded-full bg-white mt-2 flex-row justify-center"
                onPress={handleJoinClass}>
                <Text
                  className="text-base font-semibold text-gray-700 text-center flex-row"
                  style={{fontFamily: FONTS.primaryFont}}>
                  Enter Class{' '}
                </Text>
                {joinClassLoading && (
                  <ActivityIndicator
                    size={'small'}
                    color={COLORS.black}
                    style={{marginLeft: 4}}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {SHOW_RESCHEDULE}

      {
        // If user attended demo class
        // Demo has ended
        // Show post action after demo class
        showPostActions && (
          <View className="w-full">
            <PostDemoAction rescheduleClass={rescheduleClass} />
          </View>
        )
      }
    </ScrollView>
  );
};

export default Demo;

const styles = StyleSheet.create({
  contentWrapper: {
    maxWidth: 428,
  },
  rightNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnClass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 6,
  },
  paButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 100,
  },
});
