import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, Pressable, View, Linking, Alert} from 'react-native';

import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
// import Button from '../components/button.component';
import Modal from '../components/modal.component';
import {COLORS} from '../utils/constants/colors';

import {useDispatch, useSelector} from 'react-redux';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {networkSelector} from '../store/network/selector';
import {
  startFetchingBookingSlots,
  setTimezone,
  setNewBookingStart,
  setIsBookingLimitExceeded,
  closePopup,
  startFetchingIpData,
} from '../store/book-demo/book-demo.reducer';
import {
  setDemoBookingId,
  startFetchBookingDetailsFromPhone,
} from '../store/join-demo/join-demo.reducer';
import {
  setCurrentNetworkState,
  resetCurrentNetworkState,
} from '../store/network/reducer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/icon.component';
import Center from '../components/center.component';
import {LOCAL_KEYS} from '../utils/constants/local-keys';
import NetInfo from '@react-native-community/netinfo';
import {localStorage} from '../utils/storage/storage-provider';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

const BookDemoSlots = ({navigation, route, onClose}) => {
  const [currentSlotDate, setCurrentSlotDate] = useState('');
  const [currentSlotTime, setCurrentSlotTime] = useState('');
  const [slotsTime, setSlotsTime] = useState(null);

  const {
    formFields: {childAge, parentName: name, phone, childName},
  } = route.params;

  const dispatch = useDispatch();

  const {
    bookingSlots,
    timezone,
    ipData,
    isBookingLimitExceeded,
    popup,
    loading: {bookingSlotsLoading, bookingLoading},
  } = useSelector(bookDemoSelector);

  const {demoBookingId} = useSelector(joinDemoSelector);
  const {
    networkState: {isConnected, alertAction},
  } = useSelector(networkSelector);

  // Set ip data
  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     if (state.isConnected && isConnected) {
  //       if (!ipData) {
  //         dispatch(startFetchingIpData());
  //       } else {
  //         const body = {
  //           courseId: 'Eng_Hw',
  //           childAge: childAge,
  //           timeZone: timezone.toString(),
  //           type: 'website',
  //         };

  //         dispatch(startFetchingBookingSlots(body));
  //       }
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [isConnected, ipData]);

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
      courseId: 'Eng_Hw',
      childAge: childAge,
      timeZone: timezone.toString(),
      type: 'website',
    };

    dispatch(startFetchingBookingSlots(body));
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

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Book a new demo class
   */
  const handleBookNow = async () => {
    const bodyData = {
      name,
      childAge,
      phone,
      childName,
      timeZone: timezone,
      demoDate: currentSlotTime.demoDate,
      bookingType: 'direct',
      source: 'app',
      course: 'Eng_Hw',
      digits: 'na',
      slotId: currentSlotTime.slotId,
      country: ipData.country_name.toUpperCase(),
      countryCode: ipData.calling_code,
    };

    console.log('currentSlotId=', currentSlotTime.slotId);

    dispatch(setNewBookingStart({data: bodyData, ipData}));
  };

  /**
   * @author Shobhit
   * @since 07/08/2023
   * @description Show a popup after creating a booking successfully
   */
  const handlePopup = async () => {
    // if (demoBookingId) {
    //   await AsyncStorage.removeItem(LOCAL_KEYS.BOOKING_ID);
    //   dispatch(setDemoBookingId(''));
    // }
    dispatch(closePopup());
    if (onClose) {
      onClose();
    }
    localStorage.clearAll();
    console.log('phone', phone);
    localStorage.set(LOCAL_KEYS.PHONE, parseInt(phone));
    dispatch(startFetchBookingDetailsFromPhone());
    if (!onClose) {
      navigation.replace(SCREEN_NAMES.MAIN);
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
          <TextWrapper
            color={
              currentSlotDate === slot.showDate ? COLORS.white : COLORS.black
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
                : COLORS.black
            }>
            {slotTime.showTimings}
          </TextWrapper>
        </Pressable>
      );
    });
  }, [slotsTime, currentSlotDate, currentSlotTime]);

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
  ) : (
    <>
      <View style={styles.container}>
        <View style={styles.slotsWrapper}>
          <TextWrapper fs={20} color={COLORS.black} fw="bold">
            Select date:
          </TextWrapper>
          {/* Slot dates */}
          <View style={styles.slotDateList}>{SLOT_DATES}</View>
        </View>

        <Spacer />

        <View style={styles.slotsWrapper}>
          <TextWrapper fs={20} color={COLORS.black} fw="bold">
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
              <TextWrapper color={COLORS.black}>
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
      {/* <View style={styles.footer}>
        <Button
          rounded={6}
          bg={COLORS.pblue}
          onPress={handleBookNow}
          textColor={COLORS.white}>
          Book now
        </Button>
      </View> */}
      {/* show popup */}
      {popup && <Popup onHandlePopup={handlePopup} onClose={onClose} />}
      {/* Loading spinner */}
      <Modal visible={bookingLoading}>
        <Center bg="rgba(0,0,0,0.2)">
          <Spinner />
        </Center>
      </Modal>
    </>
  );
};

export default BookDemoSlots;

const Popup = ({onHandlePopup, popup, onClose}) => {
  let STYLE = {paddingTop: 30};

  if (!onClose) {
    console.log('hit onClose');
    STYLE.paddingTop = 0;
    STYLE.justifyContent = 'center';
  }

  return (
    <View style={[styles.modal, STYLE]} visible={popup}>
      <View style={styles.popup}>
        <Icon
          name="checkmark"
          size={54}
          color={COLORS.pgreen}
          style={{alignSelf: 'center'}}
        />
        <TextWrapper styles={{textAlign: 'center'}}>
          Congratulations your free class booking successful
        </TextWrapper>
        <Spacer />
        {/* <View>
          <Button
            bg={COLORS.orange}
            textColor={COLORS.white}
            rounded={4}
            onPress={onHandlePopup}>
            Continue
          </Button>
        </View> */}
      </View>
    </View>
  );
};

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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
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
