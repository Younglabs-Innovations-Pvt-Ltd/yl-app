import React, {useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from 'react-native';
import Input from '../components/input.component';
import Spacer from '../components/spacer.component';
import {Dropdown, DropdownList} from '../components/dropdown.component';
import TextWrapper from '../components/text-wrapper.component';
import Button from '../components/button.component';
import {COLORS} from '../assets/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {startFetchBookingDetailsFromId} from '../store/demo/demo.reducer';
import {useDispatch} from 'react-redux';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const GEO_LOCATION_API =
  'https://api.ipgeolocation.io/ipgeo?apiKey=db02b89808894a7a9ddef353d01805dd';

const GET_SLOTS_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/getDemoSlots';

const ADD_BOOKINGS_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/bookings/addBookings';

const INITIAL_sTATE = {
  name: '',
  childAge: null,
  phone: '',
};

const BookDemoScreen = ({navigation}) => {
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [formFields, setFormFields] = useState(INITIAL_sTATE);
  const [timezone, setTimezone] = useState('');
  const [ipData, setIpData] = useState(null);
  const [demoSlots, setDemoSlots] = useState([]);
  const [currentSlotDate, setCurrentSlotDate] = useState('');
  const [currentSlotTime, setCurrentSlotTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const getTimeZone = async () => {
      try {
        const response = await fetch(GEO_LOCATION_API, {
          method: 'GET',
        });

        const data = await response.json();
        setIpData(data);
      } catch (error) {
        console.log('Timezone error', error);
      }
    };

    getTimeZone();
  }, []);

  useEffect(() => {
    if (demoSlots.length) {
      setCurrentSlotDate(demoSlots[0].showDate);
      setCurrentSlotTime(demoSlots[0].data[0]);
    }
  }, [demoSlots]);

  useEffect(() => {
    if (ipData) {
      const tz = ipData.time_zone.offset + ipData.time_zone.dst_savings;
      setTimezone(tz);
    }
  }, [ipData]);

  const handleChangeValue = item => {
    setFormFields(preValue => ({...preValue, ...item}));
  };

  const handleOnClose = () => setOpen(false);

  const handleCurrentSlotDate = date => {
    setCurrentSlotDate(date);
    setCurrentSlotTime(demoSlots[0].data[0]);
  };

  const handleCurrentSlotTime = slotTime => setCurrentSlotTime(slotTime);

  const handleDemoSlots = async () => {
    const {childAge, name, phone} = formFields;
    if (!childAge || !timezone || !name || !phone) {
      setErrorMessage("Fields can't be empty");
      return;
    }

    try {
      const response = await fetch(GET_SLOTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: 'Eng_Hw',
          childAge: childAge,
          timeZone: timezone.toString(),
          type: 'website',
        }),
      });

      const slotsData = await response.json();
      setDemoSlots(slotsData);
      setErrorMessage('');
      console.log('data', formFields);
    } catch (error) {
      console.log('Slots error', error);
    }
  };

  const handleBookNow = async () => {
    const bodyData = {
      ...formFields,
      timeZone: timezone,
      demoDate: currentSlotTime.demoDate,
      bookingType: 'direct',
      source: 'Website',
      course: 'Eng_Hw',
      digits: 'na',
      slotId: currentSlotTime.slotId,
      country: ipData.country_name.toUpperCase(),
      countryCode: '91',
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
        navigation.goBack();
      } else if (response.status === 400) {
        console.log('bookingData', bookingData);
      }
    } catch (error) {
      console.log('booking error', error);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{height: '100%'}}>
        <View style={styles.container}>
          {!demoSlots.length ? (
            <View>
              <Input
                inputMode="text"
                placeholder="Enter your name"
                value={formFields.name}
                onChangeText={name => handleChangeValue({name})}
              />
              {errorMessage && (
                <TextWrapper fs={14} color={COLORS.pred}>
                  {errorMessage}
                </TextWrapper>
              )}
              <Spacer />
              <Input
                inputMode="numeric"
                placeholder="Enter your phone number"
                value={formFields.phone}
                onChangeText={phone => handleChangeValue({phone})}
              />
              {errorMessage && (
                <TextWrapper fs={14} color={COLORS.pred}>
                  {errorMessage}
                </TextWrapper>
              )}
              <TextWrapper fs={14} color="gray">
                Please enter valid whatsapp number to receive further class
                details
              </TextWrapper>
              <Spacer />
              <Dropdown
                defaultValue="Select child age"
                value={formFields.childAge}
                onPress={() => setOpen(true)}
                onLayout={event =>
                  setGutter(
                    event.nativeEvent.layout.y +
                      event.nativeEvent.layout.height,
                  )
                }
              />
              {errorMessage && (
                <TextWrapper fs={14} color={COLORS.pred}>
                  {errorMessage}
                </TextWrapper>
              )}
            </View>
          ) : (
            currentSlotDate &&
            currentSlotTime && (
              <DemoSlots
                slots={demoSlots}
                currentSlotDate={currentSlotDate}
                currentSlotTime={currentSlotTime}
                handleCurrentSlotDate={handleCurrentSlotDate}
                handleCurrentSlotTime={handleCurrentSlotTime}
              />
            )
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {!demoSlots.length ? (
          <Button bg={COLORS.orange} onPress={handleDemoSlots}>
            Select date and book
          </Button>
        ) : (
          <Button bg={COLORS.orange} onPress={handleBookNow}>
            Book Now
          </Button>
        )}
      </View>
      {open && (
        <DropdownList
          data={ageList}
          gutter={gutter}
          currentValue={formFields.childAge}
          onClose={handleOnClose}
          onChange={handleChangeValue}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const DemoSlots = ({
  slots,
  currentSlotDate,
  currentSlotTime,
  handleCurrentSlotTime,
  handleCurrentSlotDate,
}) => {
  const slotsTime = useMemo(() => {
    let updatedSlots = {};
    slots.forEach(slot => {
      updatedSlots[slot.showDate] = slot.data;
    });

    return updatedSlots;
  }, []);

  return (
    <View>
      <View style={styles.slotsWrapper}>
        <TextWrapper fs={20} color="gray" fw="bold">
          Select date:
        </TextWrapper>
        <View style={styles.slotDateList}>
          {slots.map(slot => {
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
          {slotsTime[currentSlotDate].map(slotTime => {
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
    </View>
  );
};

export default BookDemoScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 18,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
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
});
