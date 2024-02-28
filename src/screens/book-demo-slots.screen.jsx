import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, Pressable, View, Linking, Alert, Text} from 'react-native';

import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
import Modal from '../components/modal.component';
import {COLORS} from '../utils/constants/colors';

import {useDispatch, useSelector} from 'react-redux';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {networkSelector} from '../store/network/selector';
import {
  startFetchingBookingSlots,
  setTimezone,
  setIsBookingLimitExceeded,
  closePopup,
  startFetchingIpData,
  setSelectedSlot,
} from '../store/book-demo/book-demo.reducer';
import {logout} from '../store/auth/reducer';
import {resetCurrentNetworkState} from '../store/network/reducer';
import Icon from '../components/icon.component';
import {LOCAL_KEYS} from '../utils/constants/local-keys';
import {localStorage} from '../utils/storage/storage-provider';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS} from '../utils/constants/fonts';
import {removeRegisterNotificationTimer} from '../natiive-modules/timer-notification';
import {getWhatsappRedirectUrl} from '../utils/redirect-whatsapp';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';

const BookDemoSlots = ({
  navigation,
  formData,
  onClose,
  courseId,
  courseData,
}) => {
  const [currentSlotDate, setCurrentSlotDate] = useState('');
  const [currentSlotTime, setCurrentSlotTime] = useState('');
  const [slotsTime, setSlotsTime] = useState(null);
  const {textColors} = useSelector(state => state.appTheme);
  const {childAge, phone} = formData;

  const dispatch = useDispatch();
  const toast = useToast();

  const {
    bookingSlots,
    timezone,
    ipData,
    isBookingLimitExceeded,
    loading: {bookingSlotsLoading},
    childData,
  } = useSelector(bookDemoSelector);

  // console.log('Booking Slots are', bookingSlots);
  // const {demoBookingId} = useSelector(joinDemoSelector);
  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);

  // Set ip data
  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  // Set timezone
  useEffect(() => {
    if (ipData) {
      const tz = ipData.time_zone.offset + ipData.time_zone.dst_savings;
      dispatch(setTimezone(tz));
    }
  }, [ipData]);

  // Fetch booking slots
  useEffect(() => {
    if (!timezone) return;
    const body = {
      courseId: courseId || 'Eng_Hw',
      childAge: childAge,
      timeZone: timezone.toString(),
      type: 'website',
    };

    if (bookingSlots.length < 1) {
      dispatch(startFetchingBookingSlots(body));
    }
  }, [timezone]);

  // set booking slot date and time
  useEffect(() => {
    if (bookingSlots.length) {
      setCurrentSlotDate(bookingSlots[0].showDate);
      setCurrentSlotTime(bookingSlots[0].data[0]);
    }
  }, [bookingSlots.length]);

  // arrange booking slots to an object
  useEffect(() => {
    if (bookingSlots.length) {
      let updatedSlots = {};
      bookingSlots.forEach(slot => {
        updatedSlots[slot.showDate] = slot.data;
      });

      setSlotsTime(updatedSlots);
    }
  }, [bookingSlots.length]);

  // Set current slots date
  const handleCurrentSlotDate = date => {
    setCurrentSlotDate(date);
    setCurrentSlotTime(slotsTime[date][0]);
  };

  // Set current slots time
  const handleCurrentSlotTime = slotTime => setCurrentSlotTime(slotTime);

  useEffect(() => {
    dispatch(setSelectedSlot(currentSlotTime));
  }, [currentSlotTime]);

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Book a new demo class


  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Show a popup after creating a booking successfully
   */
  const handlePopup = async () => {
    dispatch(closePopup());
    localStorage.clearAll();
    removeRegisterNotificationTimer();
    console.log('phone', phone);
    localStorage.set(LOCAL_KEYS.PHONE, parseInt(phone));
    dispatch(logout());
    if (!onClose) {
      navigation.replace(SCREEN_NAMES.MAIN);
    } else {
      onClose();
    }
  };

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Contact us, Redirect to Whatsapp
   */

  const handleContactUs = async () => {
    const phoneNumber = '+919289029696';
    let url = '';

    if (Platform.OS === 'android') {
      url = `whatsapp://send?phone=${phoneNumber}&text=My booking limit of English Handwriting free Class is exceeded on app, I want to book the class again.`;
    } else if (Platform.OS === 'ios') {
      url = `whatsapp://wa.me/${phoneNumber}&text=My booking limit of English Handwriting free Class is exceeded on app, I want to book the class again.`;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  // Close booking limit exceeded modal
  const closeModal = () => dispatch(setIsBookingLimitExceeded(false));

  // UI Constants
  // Slot dates
  const SLOT_DATES = useMemo(() => {
    return bookingSlots.map(slot => {
      return (
        <Pressable
          style={[
            styles.slotDate,
            currentSlotDate === slot.showDate
              ? {backgroundColor: COLORS.pblue}
              : {borderWidth: 1, borderColor: 'gray'},
          ]}
          key={slot.showDate}
          onPress={() => handleCurrentSlotDate(slot.showDate)}>
          {console.log('showdate is', slot.showDate)}
          <TextWrapper
            color={
              currentSlotDate === slot.showDate ? COLORS.white : textColors.textSecondary
            }>
            {slot.showDate}
          </TextWrapper>
        </Pressable>
      );
    });
  }, [bookingSlots, currentSlotDate]);

  // Slot time against slot dates
  const SLOT_TIMES = useMemo(() => {
    if (!slotsTime) return null;

    return slotsTime[currentSlotDate].map(slotTime => {
      return (
        <Pressable
          style={[
            styles.slotDate,
            currentSlotTime.showTimings === slotTime.showTimings
              ? {backgroundColor: COLORS.pblue}
              : {borderWidth: 1, borderColor: 'gray'},
          ]}
          key={slotTime.slotId}
          onPress={() => handleCurrentSlotTime(slotTime)}>
          <TextWrapper
            color={
              currentSlotTime.showTimings === slotTime.showTimings
                ? COLORS.white
                : textColors.textSecondary
            }>
            {slotTime.showTimings}
          </TextWrapper>
        </Pressable>
      );
    });
  }, [slotsTime, currentSlotDate, currentSlotTime]);

  const NoDemoSlotsScreen = () => {
    const {textColors} = useSelector(state => state.appTheme);

    const reqBatchonWhatsapp = async () => {
      try {
        const message = `Hi! i would love to take a Demo of ${courseData?.alternativeNameOnApp}.`;
        const whatsappRedLink = getWhatsappRedirectUrl(message);
        await Linking.openURL(whatsappRedLink);
      } catch (error) {
        console.log('error in sending whatsapp for demo', error.message);
        Showtoast({
          text: "Couldn't Complete the Request, Please ensure you have Whatsapp app and try again",
          toast,
          type: 'danger',
        });
      }
    };

    return (
      <View className="w-full mt-4 items-center pb-4">
        <View className="items-center w-[95%]">
          <Text
            className="text-center w-full"
            style={[FONTS.heading, {color: textColors.textPrimary}]}>
            No Demo Slots Created
          </Text>
          <Text
            className="text-center w-full text-base mt-3"
            style={[FONTS.primary, {color: textColors.textSecondary}]}>
            Contact with us on Whatsapp to book your free class.
          </Text>
        </View>
        <View className="flex-row justify-around">
          <Pressable
            className="flex-row w-[90%] rounded-full py-2 justify-center items-center mt-3"
            style={{backgroundColor: textColors.textYlGreen}}
            onPress={reqBatchonWhatsapp}>
            <MIcon name="whatsapp" size={30} color="white" />
            <Text
              className="text-white text-base ml-2"
              style={[{fontFamily: FONTS.primaryFont}]}>
              Whatsapp us
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (!isConnected) {
    Alert.alert(
      '',
      'We cannot continue due to network problem. Please check your network connection.',
      [
        {
          text: 'Refresh',
          onPress: () => {
            dispatch(resetCurrentNetworkState());
            dispatch(alertAction);
          },
        },
        {
          text: 'CANCEL',
          onPress: () => {
            dispatch(resetCurrentNetworkState());
          },
        },
      ],
    );
  }

  return bookingSlotsLoading ? (
    <Spinner style={{alignSelf: 'center'}} />
  ) : bookingSlots && bookingSlots.length > 0 ? (
    <>
      {/* {console.log("i am here")} */}
      <View className=" w-full px-2 mt-2">
        <View className="p-1 bg-gray-300 rounded-md my-3">
          <Text className="text-gray-700 ml-1 ">
            Booking free class for{' '}
            <Text className="font-semibold capitalize">
              {childData?.childName}
            </Text>
          </Text>
        </View>
        <View style={styles.slotsWrapper}>
          <TextWrapper fs={20} color={textColors.textPrimary} fw="bold">
            Select date:
          </TextWrapper>
          <View style={styles.slotDateList}>{SLOT_DATES}</View>
        </View>

        <Spacer />

        <View style={styles.slotsWrapper}>
          <TextWrapper fs={20} color={textColors.textPrimary} fw="bold">
            Select time:
          </TextWrapper>
          {/* Slot times */}
          <View style={styles.slotDateList}>{SLOT_TIMES}</View>
        </View>
        {/* Booking limit exceeded Modal */}
        <Modal visible={isBookingLimitExceeded} onRequestClose={closeModal}>
          <View style={styles.bookingModalContainer}>
            <View style={styles.bookingModal}>
              <View style={{paddingBottom: 18, alignItems: 'flex-end'}}>
                <Pressable onPress={closeModal}>
                  <Icon name="close-outline" size={24} color={COLORS.black} />
                </Pressable>
              </View>
              <TextWrapper
                color={COLORS.black}
                className="text-center text-xl font-semibold w-full">
                Your booking limit exceeded, Contact us to book again.
              </TextWrapper>
              <Spacer space={16} />
              <Pressable style={styles.btnBookAgain} onPress={handleContactUs}>
                <Icon
                  name="logo-whatsapp"
                  size={24}
                  color={COLORS.white}
                  style={{marginRight: 8}}
                />
                <TextWrapper fs={18} color={COLORS.white}>
                  Contact us
                </TextWrapper>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.footer}></View>
    </>
  ) : (
    <NoDemoSlotsScreen />
  );
};

export default BookDemoSlots;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 18,
  },
  slotsWrapper: {
    width: '100%',
  },
  slotDateList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 12,
  },
  slotDate: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  popup: {
    maxWidth: 348,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    elevation: 4,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
  },
  btnBookAgain: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pblue,
    flexDirection: 'row',
    borderRadius: 4,
  },
  bookingModal: {
    width: '100%',
    maxWidth: 348,
    minHeight: 180,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 4,
  },
  bookingModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
  },
});
