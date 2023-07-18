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

import {startFetchBookingDetailsFromId} from '../store/join-demo/join-demo.reducer';
import {useDispatch} from 'react-redux';
import CountryList from '../components/country-list.component';
import {isValidNumber} from '../utils/isValidNumber';
import Spinner from '../components/spinner.component';
import Modal from '../components/modal.component';

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
  const [errorMessage, setErrorMessage] = useState({
    phone: '',
    name: '',
    childAge: '',
  });
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState({callingCode: ''});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const getTimeZone = async () => {
      try {
        setLoading(true);
        const response = await fetch(GEO_LOCATION_API, {
          method: 'GET',
        });

        const data = await response.json();
        setCountry({
          callingCode: data.calling_code,
          countryCode: {cca2: data.country_code2},
        });
        setIpData(data);
        setLoading(false);
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

    if (!childAge || !name || !phone) {
      setErrorMessage({
        ...errorMessage,
        name: 'Fields are required.',
        childAge: 'Fields are required.',
        phone: 'Fields are required.',
      });
      return;
    }

    if (!childAge) {
      setErrorMessage({...errorMessage, childAge: 'Select child age'});
      return;
    } else if (!name) {
      setErrorMessage({...errorMessage, name: 'Please enter your name'});
      return;
    } else if (!phone) {
      setErrorMessage({...errorMessage, phone: 'Please enter phone number'});
      return;
    }

    const isValidPhone = await isValidNumber(phone, country.countryCode.cca2);
    if (!isValidPhone) {
      setErrorMessage({...errorMessage, phone: 'Please enter a valid number'});
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

  const handleSelectCountry = country => {
    let code = '';
    if (country.callingCode.hasOwnProperty('root')) {
      code = country.callingCode.root.concat(country.callingCode.suffixes[0]);
      country.callingCode = code;
    }
    setCountry(country);
    setVisible(false);
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
              {errorMessage.name && (
                <TextWrapper fs={14} color={COLORS.pred}>
                  {errorMessage.name}
                </TextWrapper>
              )}
              <Spacer />
              <View style={styles.row}>
                <Pressable
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.black,
                  }}
                  onPress={() => setVisible(p => !p)}>
                  <TextWrapper>{country.callingCode}</TextWrapper>
                </Pressable>
                <Input
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={formFields.phone}
                  onChangeText={phone => handleChangeValue({phone})}
                />
              </View>
              {errorMessage.phone && (
                <TextWrapper fs={14} color={COLORS.pred}>
                  {errorMessage.phone}
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
              {errorMessage.childAge && (
                <TextWrapper fs={14} color={COLORS.pred}>
                  {errorMessage.childAge}
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
      <CountryList
        visible={visible}
        onChangeVisible={v => setVisible(v)}
        onSelect={handleSelectCountry}
      />
      {open && (
        <DropdownList
          data={ageList}
          gutter={gutter}
          currentValue={formFields.childAge}
          onClose={handleOnClose}
          onChange={handleChangeValue}
        />
      )}
      {loading && (
        <Modal bg="rgba(0,0,0,0.25)">
          <Spinner />
        </Modal>
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
  // Arrange slot time by show date
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
});
