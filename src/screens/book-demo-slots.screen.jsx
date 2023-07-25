import React, {useState, useEffect} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
import Button from '../components/button.component';
import {COLORS} from '../assets/theme/theme';

import {useDispatch, useSelector} from 'react-redux';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingBookingSlots} from '../store/book-demo/book-demo.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/icon.component';
import Center from '../components/center.component';

const ADD_BOOKINGS_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/bookings/addBookings';

const BookDemoSlots = ({route, navigation}) => {
  const [currentSlotDate, setCurrentSlotDate] = useState('');
  const [currentSlotTime, setCurrentSlotTime] = useState('');
  const [slotsTime, setSlotsTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [popup, setPopup] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const {
    formFields: {childAge, name, phone},
  } = route.params;

  const dispatch = useDispatch();
  const {bookingSlots, timezone, ipData, loading} =
    useSelector(bookDemoSelector);

  // Fetch booking slots
  useEffect(() => {
    const body = {
      courseId: 'Eng_Hw',
      childAge: childAge,
      timeZone: timezone.toString(),
      type: 'website',
    };
    dispatch(startFetchingBookingSlots(body));
  }, []);

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

  // set current slots time
  const handleCurrentSlotTime = slotTime => setCurrentSlotTime(slotTime);

  // Book a demo
  const handleBookNow = async () => {
    const bodyData = {
      name,
      childAge,
      phone,
      timeZone: timezone,
      demoDate: currentSlotTime.demoDate,
      bookingType: 'direct',
      source: 'Website',
      course: 'Eng_Hw',
      digits: 'na',
      slotId: currentSlotTime.slotId,
      country: ipData.country_name.toUpperCase(),
      countryCode: ipData.calling_code,
      websiteSrc: 'website',
    };

    try {
      const response = await fetch(ADD_BOOKINGS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const bookingDetails = await response.json();
      if (response.status === 200) {
        await AsyncStorage.setItem('phone', phone);

        // set booking Data
        setBookingData(bookingDetails);
        // show popup
        setPopup(true);
      } else if (response.status === 400) {
        console.log('booking data', bookingDetails);

        setErrorMessage(bookingDetails.message);
      }
    } catch (error) {
      console.log('booking error', error);
    }
  };

  const handlePopup = () => {
    if (errorMessage) setErrorMessage('');
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });

    navigation.dispatch(resetAction);
  };

  return loading ? (
    <Spinner style={{alignSelf: 'center'}} />
  ) : (
    <>
      <View style={styles.container}>
        <View style={styles.slotsWrapper}>
          <TextWrapper fs={20} color="gray" fw="bold">
            Select date:
          </TextWrapper>
          <View style={styles.slotDateList}>
            {bookingSlots.map(slot => {
              return (
                <Pressable
                  style={[
                    styles.slotDate,
                    currentSlotDate === slot.showDate
                      ? {backgroundColor: COLORS.pgreen}
                      : {borderWidth: 1, borderColor: 'gray'},
                  ]}
                  key={slot.showDate}
                  onPress={() => handleCurrentSlotDate(slot.showDate)}>
                  <TextWrapper
                    color={
                      currentSlotDate === slot.showDate
                        ? COLORS.white
                        : COLORS.black
                    }>
                    {slot.showDate}
                  </TextWrapper>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Spacer />

        <View style={styles.slotsWrapper}>
          <TextWrapper fs={20} color="gray" fw="bold">
            Select time:
          </TextWrapper>
          <View style={styles.slotDateList}>
            {slotsTime &&
              slotsTime[currentSlotDate].map(slotTime => {
                return (
                  <Pressable
                    style={[
                      styles.slotDate,
                      currentSlotTime.showTimings === slotTime.showTimings
                        ? {backgroundColor: COLORS.pgreen}
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
              })}
          </View>
        </View>
        {errorMessage && (
          <TextWrapper color={COLORS.pred}>{errorMessage}</TextWrapper>
        )}
      </View>
      <View style={styles.footer}>
        <Button
          bg={COLORS.pgreen}
          onPress={handleBookNow}
          textColor={COLORS.white}>
          Book now
        </Button>
      </View>
      {/* show popup */}
      {popup && <Popup onHandlePopup={handlePopup} />}
    </>
  );
};

export default BookDemoSlots;

const Popup = ({onHandlePopup, popup}) => {
  return (
    <View style={styles.modal} visible={popup}>
      <Center>
        <View style={styles.popup}>
          <Icon
            name="checkmark"
            size={54}
            color={COLORS.pgreen}
            style={{alignSelf: 'center'}}
          />
          <TextWrapper styles={{textAlign: 'center'}}>
            Congratulation your free class booking successful
          </TextWrapper>
          <Spacer />
          <View>
            <Button
              bg={COLORS.orange}
              textColor={COLORS.white}
              rounded={4}
              onPress={onHandlePopup}>
              Continue
            </Button>
          </View>
        </View>
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  popup: {
    maxWidth: 324,
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
    justifyContent: 'center',
  },
});
