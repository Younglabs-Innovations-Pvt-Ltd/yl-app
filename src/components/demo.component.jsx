import React, {useMemo, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import DemoWaiting from './join-demo-class-screen/demo-waiting.component';
import Button from './button.component';
import Spacer from './spacer.component';
import TextWrapper from './text-wrapper.component';
import PostDemoAction from './join-demo-class-screen/post-demo-actions.component';
import Input from './input.component';
import {COLORS} from '../utils/constants/colors';

import {useDispatch, useSelector} from 'react-redux';
import {joinFreeClass} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {i18nContext} from '../context/lang.context';
import Modal from './modal.component';
import BookDemoSlots from '../screens/book-demo-slots.screen';
import TwoStepForm from './two-step-form.component';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {FONTS} from '../utils/constants/fonts';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

const Demo = ({isTimeover, timeLeft, showPostActions}) => {
  const [childName, setChildName] = useState('');
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState(null);
  const [cn, setCn] = useState(false);

  const {localLang} = i18nContext();
  const dispatch = useDispatch();

  const {
    demoData,
    bookingDetails,
    bookingTime,
    showJoinButton,
    teamUrl,
    message,
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
    if (bookingDetails) {
      const {childAge, parentName, phone, childName} = bookingDetails;
      const formFields = {childAge, parentName, phone, childName};
      setParams(formFields);
    }
  }, [bookingDetails]);

  // on change for child name
  const onChangeChildName = e => {
    setChildName(e);
  };

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onOpenForm = () => setVisible(true);
  const onCloseForm = () => setVisible(false);

  // Join Class
  const handleJoinClass = async () => {
    dispatch(joinFreeClass({bookingDetails, childName, teamUrl}));
  };

  //   UI Constants
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
      <TextWrapper
        color={COLORS.white}
        fs={20}
        ff={FONTS.signika_semiBold}
        styles={{marginBottom: 12}}>
        Class is on going, Join now.
      </TextWrapper>
    );
  }, [cn, childName, message]);

  const NEW_BOOKING = useMemo(() => {
    if (demoData?.message === 'Booking not found' || !demoData) {
      return (
        <View style={{paddingTop: 12}}>
          <TextWrapper fs={24} ff={FONTS.signika_semiBold} color={COLORS.white}>
            Improve your child's handwriting
          </TextWrapper>
          <TextWrapper fs={20} color={COLORS.white}>
            Book your first free Handwriting Class.
          </TextWrapper>
          <Spacer />
          <Button
            textColor={'#434a52'}
            bg={COLORS.white}
            rounded={6}
            onPress={onOpenForm}>
            Book Now
          </Button>
        </View>
      );
    } else {
      return null;
    }
  }, [demoData, onOpenForm]);

  const navigation = useNavigation();

  const courseDetails = () => {
    navigation.navigate(SCREEN_NAMES.COURSE_DETAILS);
  };

  return (
    <View style={styles.contentWrapper}>
      {NEW_BOOKING}
      {/* Timer */}
      {SHOW_TIMER && <DemoWaiting timeLeft={timeLeft} />}

      {/* Show join button */}
      {SHOW_JOIN_BUTTON && (
        <View>
          {IS_CHILD_NAME}
          <Button
            textColor={'#434a52'}
            bg={COLORS.white}
            rounded={6}
            onPress={handleJoinClass}>
            Enter class
          </Button>
        </View>
      )}
      {isTimeover && !teamUrl && (
        <View
          style={{
            paddingVertical: 16,
          }}>
          <TextWrapper color={COLORS.white} fs={20}>
            {localLang.rescheduleText}
          </TextWrapper>
          <Spacer />
          <Button
            textColor={COLORS.black}
            bg={COLORS.white}
            rounded={6}
            onPress={onOpen}>
            {localLang.rescheduleButtonText}
          </Button>
        </View>
      )}
      {
        // If user attended demo class
        // Demo has ended
        // Show post action after demo class
        showPostActions && <PostDemoAction rescheduleClass={onOpen} />
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

      <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={onCloseForm}>
        <View style={{flex: 1}}>
          <Pressable
            style={{
              height: deviceHeight * 0.35,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
            onPress={onCloseForm}></Pressable>
          <TwoStepForm closeModal={onCloseForm} />
        </View>
      </Modal>
    </View>
  );
};

export default Demo;

const styles = StyleSheet.create({
  contentWrapper: {
    maxWidth: 428,
    alignSelf: 'center',
  },
  rightNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
