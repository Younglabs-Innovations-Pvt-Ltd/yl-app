import React, {useMemo, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
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
import Modal from './modal.component';
import BookDemoSlots from '../screens/book-demo-slots.screen';
import {FONTS} from '../utils/constants/fonts';
import moment from 'moment';
import {TextInput} from 'react-native-gesture-handler';

const {height: deviceHeight} = Dimensions.get('window');

const Demo = ({timeLeft, showPostActions, rescheduleClass}) => {
  const [childName, setChildName] = useState('');
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState(null);
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

  // console.log("is Time Over=" ,isTimeover)

  useEffect(() => {
    if (bookingDetails) {
      const {childAge, parentName, phone, childName} = bookingDetails;
      const formFields = {childAge, parentName, phone, childName};
      setParams(formFields);
    }
  }, [bookingDetails]);

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

  const onClose = () => setOpen(false);

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

    if (moment().isAfter(moment(bookingTime)) && !teamUrl) {
      return (
        <View style={{padding: 16}}>
          <TextWrapper color={COLORS.white} ff={FONTS.primaryFont} fs={15}>
            You missed your class. You can reschedule next class.
          </TextWrapper>
          <Pressable
            style={({pressed}) => [
              styles.paButton,
              {
                opacity: pressed ? 0.7 : 1,
                marginTop: 6,
              },
            ]}
            onPress={rescheduleClass}>
            <TextWrapper color={'#434a52'} fs={16.5} ff={FONTS.primaryFont}>
              Reschedule
            </TextWrapper>
          </Pressable>
        </View>
      );
    }
  }, [teamUrl, bookingTime, isAttended, rescheduleClass]);

  return (
    <ScrollView
      style={styles.contentWrapper}
      showsVerticalScrollIndicator={false}>
      {/* {NEW_BOOKING} */}
      {/* Timer */}
      {SHOW_TIMER && !isClassOngoing && <DemoWaiting timeLeft={timeLeft} />}
      {/* Show join button */}
      {isClassOngoing && (
        <View style={{paddingHorizontal: 16, paddingVertical: 6}}>
          {IS_CHILD_NAME}
          <View className="w-full p-1 px-3">
            <Text
              className="text-white font-semibold text-base ml-3"
              style={{fontFamily: FONTS.primaryFont}}>
              Your Demo class is going on
            </Text>
            <View className="w-full">
              <Pressable
                className="p-2 w-full rounded-full bg-white mt-2 flex-row justify-center"
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
            <PostDemoAction rescheduleClass={openResheduleSheet} />
          </View>
        )
      }

      {/* <Modal animationType="fade" visible={open} onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
          onPress={onClose}>
          <Pressable
            style={{
              height: deviceHeight * 0.3,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
            onPress={onClose}></Pressable>
          <View
            style={{
              height: deviceHeight * 0.7,
              backgroundColor: COLORS.white,
            }}>
            <BookDemoSlots
              route={{params: {formFields: params}}}
              onClose={onClose}
            />
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

export default Demo;

const styles = StyleSheet.create({
  contentWrapper: {
    maxWidth: 428,
    // alignSelf: 'center',
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
    paddingHorizontal: 2,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 50,
  },
});
