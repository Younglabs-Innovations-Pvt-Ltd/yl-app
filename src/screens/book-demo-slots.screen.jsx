import React, {useState, useEffect} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';

import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import Spinner from '../components/spinner.component';
import Button from '../components/button.component';
import {COLORS} from '../assets/theme/theme';

import {useDispatch, useSelector} from 'react-redux';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingBookingSlots} from '../store/book-demo/book-demo.reducer';
import {startFetchBookingDetailsFromId} from '../store/join-demo/join-demo.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADD_BOOKINGS_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/bookings/addBookings';

const BookDemoSlots = ({route, navigation}) => {
  const [currentSlotDate, setCurrentSlotDate] = useState('');
  const [currentSlotTime, setCurrentSlotTime] = useState('');
  const [slotsTime, setSlotsTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    formFields: {childAge, name, phone},
  } = route.params;

  const dispatch = useDispatch();
  const {bookingSlots, timezone, ipData} = useSelector(bookDemoSelector);

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
    setCurrentSlotTime(bookingSlots[0].data[0]);
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

      const bookingData = await response.json();
      if (response.status === 200) {
        console.log('bookingData', bookingData);

        await AsyncStorage.setItem(
          'bookingid',
          JSON.stringify(bookingData.bookingId),
        );
        dispatch(startFetchBookingDetailsFromId(bookingData.bookingId));
        if (errorMessage) setErrorMessage('');
        navigation.replace('joinDemo');
      } else if (response.status === 400) {
        console.log('booking data', bookingData);

        setErrorMessage(bookingData.message);
      }
    } catch (error) {
      console.log('booking error', error);
    }
  };

  return bookingSlots.length === 0 ? (
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
        <Button bg={COLORS.pgreen} onPress={handleBookNow}>
          Book now
        </Button>
      </View>
    </>
  );
};

export default BookDemoSlots;

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
});
