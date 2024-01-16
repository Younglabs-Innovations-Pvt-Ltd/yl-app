import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {bookDemoSelector} from '../../store/book-demo/book-demo.selector';
import {
  setSelectedOneToOneDemoTime,
  setTimezone,
} from '../../store/book-demo/book-demo.reducer';
import moment from 'moment';
import ShowSnackbar from '../../utils/Snackbar';
import Snackbar from 'react-native-snackbar';
import {useToast} from 'react-native-toast-notifications';
import {Showtoast} from '../../utils/toast';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const OneToOneDemoBook = ({
  navigation,
  formData,
  courseId,
  selectedDemoType,
}) => {
  const toast = useToast();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDemoDate, setSelectedDemoDate] = useState(null);
  const {textColors , bgColor} = useSelector(state => state.appTheme);
  const {childAge, parentName: name, phone, childName} = formData;
  const dispatch = useDispatch();

  console.log('user selected date', selectedDemoDate);

  useEffect(() => {
    dispatch(setSelectedOneToOneDemoTime(selectedDemoDate));
  }, [selectedDemoDate]);

  console.log('i am here');
  const {
    bookingSlots,
    timezone,
    ipData,
    isBookingLimitExceeded,
    popup,
    loading: {bookingSlotsLoading, bookingLoading},
    bookingCreatedSuccessfully,
    childData,
    selectedOneToOneDemoTime,
  } = useSelector(bookDemoSelector);

  useEffect(() => {
    if (ipData) {
      const tz = ipData.time_zone.offset + ipData.time_zone.dst_savings;
      dispatch(setTimezone(tz));
    }
  }, [ipData]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const dateCheckPassed = date => {
    const dateSelectd = moment(date);
    const currentDate = moment();

    if (dateSelectd.isBefore(currentDate)) {
      console.log('select date from today onwards');
      Showtoast({text: 'Select date from today', toast});
      return false;
    }

    const differenceInDays = dateSelectd.diff(currentDate, 'days');
    if (differenceInDays > 7) {
      Showtoast({text: 'Choose Demo date between 7 days span', toast});
      return false;
    }

    return true;
  };

  const handleConfirm = date => {
    hideDatePicker();
    if (dateCheckPassed(date)) {
      setSelectedDemoDate(date);
    }
  };

  const showToastnow = () => {
    Showtoast({text: 'Select date from today', toast});
  };

  return (
    <View className="pt-6 w-full pb-5">
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View className="">
        <Text
          className="font-semibold text-center"
          style={{color: textColors.textPrimary, fontSize: 18}}>
          Choose A Preferred Date
        </Text>
        <Text
          className="font-semibold text-center"
          style={{color: textColors.textSecondary, fontSize: 11}}>
          (Date should be in between of today and among next 7 days )
        </Text>

        {console.log(
          'selectedDemotime type is',
          typeof selectedOneToOneDemoTime,
        )}
        <View className="w-full mt-5">
          <View className="flex-col items-center w-full justify-center">
            <View
              className="h-20 w-20 rounded-full border items-center justify-center"
              style={{
                borderColor: textColors.textYlMain,
                backgroundColor:
                  selectedOneToOneDemoTime
                    ? textColors.textYlMain
                    : bgColor,
              }}>
              <MIcon
                name="calendar-clock"
                size={45}
                color={
                  selectedOneToOneDemoTime
                    ? 'white'
                    : textColors.textYlMain
                }
                onPress={showDatePicker}
              />
            </View>

            <View className="w-full mt-2">
              {selectedOneToOneDemoTime ? (
                <Text
                  className="w-full text-center text-[15px] font-semibold"
                  style={{color: textColors.textSecondary}}>
                  {`You have selected: ${moment(
                    selectedOneToOneDemoTime,
                  ).format('DD-MM-YYYY hh:mm A')}`}
                </Text>
              ) : (
                <Pressable className="w-full items-center">
                  <Text className="text-[12px] font-semibold text-base w-full text-center" style={{color:textColors.textSecondary}}>
                    Click on Calendar to select date
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OneToOneDemoBook;
