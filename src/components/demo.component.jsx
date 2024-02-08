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
// import Button from './button.component';
import Spacer from './spacer.component';
import TextWrapper from './text-wrapper.component';
import PostDemoAction from './join-demo-class-screen/post-demo-actions.component';
import Input from './input.component';
import {COLORS} from '../utils/constants/colors';

import {useDispatch, useSelector} from 'react-redux';
import {
  joinFreeClass,
  setJoinClassErrorMsg,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {i18nContext} from '../context/lang.context';
import Modal from './modal.component';
import BookDemoSlots from '../screens/book-demo-slots.screen';
import TwoStepForm from './two-step-form.component';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {FONTS} from '../utils/constants/fonts';
import moment from 'moment';
import {TextInput} from 'react-native-gesture-handler';
import {userSelector} from '../store/user/selector';

const {height: deviceHeight} = Dimensions.get('window');

const Demo = ({
  isTimeover,
  timeLeft,
  showPostActions,
  sheetOpen,
  openResheduleSheet,
  closeResheduleSheet,
}) => {
  const [childName, setChildName] = useState('');
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState(null);
  const [cn, setCn] = useState(false);

  const {localLang} = i18nContext();
  const dispatch = useDispatch();
  const {darkMode, bgColor, textColors, colorYlMain, bgSecondaryColor} =
    useSelector(state => state.appTheme);

  const {
    demoData,
    bookingDetails,
    bookingTime,
    message,
    isClassOngoing,
    joinClassLoading,
    joinClassErrorMsg,
  } = useSelector(joinDemoSelector);

  const {isFirstTimeUser} = useSelector(userSelector);
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

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onOpenForm = () => setVisible(true);
  const onCloseForm = () => setVisible(false);

  // console.log("demodata is" , demoData)
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

  // show join button to join class
  // const SHOW_JOIN_BUTTON = useMemo(() => {
  //   return isClassOngoing;
  // }, [isClassOngoing]);

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
    // <TextWrapper
    //   color={COLORS.white}
    //   fs={20}
    //   ff={FONTS.signika_semiBold}
    //   styles={{marginBottom: 12}}>
    //   Class is on going, Join now.
    // </TextWrapper>
  }, [cn, childName, message]);

  const NEW_BOOKING = useMemo(() => {
    if (isFirstTimeUser) {
      return (
        <View style={{padding: 4}} className="flex-row justify-between">
          <View>
            <TextWrapper fs={18} ff={FONTS.headingFont} color={COLORS.white}>
              Improve your child's handwriting
            </TextWrapper>
            <TextWrapper fs={16} color={COLORS.white}>
              Book your first free Handwriting Class.
            </TextWrapper>
          </View>
          <View className="h-full items-center justify-center">
            <Pressable
              // onPress={()=>{openBottomSheet}}
              onPress={() => sheetOpen()}
              className="bg-white text-blue-500 py-2 px-3 rounded-md">
              <Text
                className="font-semibold"
                style={{color: textColors.textYlMain}}>
                Book Now
              </Text>
            </Pressable>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }, [demoData, onOpenForm]);

  // post actions
  const POST_ACTIONS = useMemo(() => {
    if (!bookingTime) return null;

    return moment().isAfter(moment(bookingTime).add(1, 'hours')) ? (
      <PostDemoAction rescheduleClass={onOpen} />
    ) : null;
  }, [bookingTime, onOpen]);

  const navigation = useNavigation();

  const courseDetails = () => {
    navigation.navigate(SCREEN_NAMES.COURSE_DETAILS);
  };

  // console.log('isClass Ongoing', isClassOngoing, 'Show TImer is', SHOW_TIMER);

  return (
    <ScrollView
      style={styles.contentWrapper}
      showsVerticalScrollIndicator={false}>
      {NEW_BOOKING}
      {/* Timer */}
      {SHOW_TIMER && !isClassOngoing && <DemoWaiting timeLeft={timeLeft} />}
      {/* Show join button */}
      {isClassOngoing && (
        <View style={{paddingHorizontal: 16, paddingTop: 12}}>
          {IS_CHILD_NAME}
          <View className="w-full p-1 px-3">
            <Text className="text-white font-semibold text-base ml-3 ">
              Your free handwriting class is going on
            </Text>
            <View className="w-full">
              <Pressable
                className="p-2 w-full rounded-full bg-white mt-2 flex-row justify-center"
                onPress={handleJoinClass}>
                <Text className="text-base font-semibold text-gray-700 text-center flex-row">
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

      <Modal animationType="fade" visible={open} onRequestClose={onClose}>
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
      </Modal>
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
});
