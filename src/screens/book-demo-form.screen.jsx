import React, {useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import CheckBox from '@react-native-community/checkbox';
import Input from '../components/CustomInputComponent';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {Dropdown, DropdownList} from '../components/dropdown.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-gesture-handler';
import BookDemoSlots from './book-demo-slots.screen';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {
  changebookingCreatedSuccessfully,
  setChildData,
  setNewBookingStart,
  setNewOneToOneBookingStart,
  startFetchingIpData,
  setOneToOneBookingFailed2,
} from '../store/book-demo/book-demo.reducer';
import {current} from '@reduxjs/toolkit';
import DropdownComponent from '../components/DropdownComponent';
import OneToOneDemoBook from '../components/demoComponents/OneToOneDemoBook';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {FONTS} from '../utils/constants/fonts';
import {authSelector} from '../store/auth/selector';
import {startGetAllBookings} from '../store/welcome-screen/reducer';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const INITIAL_sTATE = {
  parentName: '',
  childName: '',
};

const bookingSteps = [
  {
    label: 'Enter Details',
    step: 1,
  },
  {
    label: 'Select Timings',
    step: 2,
  },
  {
    label: 'You are done',
    step: 3,
  },
];

const BookDemoScreen = ({
  data,
  navigation,
  courseId,
  setSelectedTab,
  place,
}) => {
  const toast = useToast();
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [childAge, setChildAge] = useState(null);
  const [fields, setFields] = useState(INITIAL_sTATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCurrentStepDataFilled, setIsCurrentStepDataFilled] = useState(false);
  const [selectedDemoType, setSelectedDemoType] = useState('solo');
  const {textColors, bgSecondaryColor, bgColor, darkMode} = useSelector(
    state => state.appTheme,
  );
  const {
    timezone,
    selectedSlot,
    ipData,
    childData,
    bookingCreatedSuccessfully,
    loading,
    selectedOneToOneDemoTime,
    bookingFailReason,
    oneToOneBookingFailed,
  } = useSelector(bookDemoSelector);

  const {user} = useSelector(authSelector);

  const phone = user?.phone;
  // console.log("ChildData is", childData)
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  // useEffect(() => {
  //   if (fields.childName && fields.parentName) {
  //     console.log('Changing 2');
  //     setCurrentStep(2);
  //   }
  // }, []);

  useEffect(() => {
    setIsCurrentStepDataFilled(false);
  }, [currentStep]);

  // useEffect(() => {
  //   console.log('running useEffect');
  //   if (currentStep === 1) {
  //     if (fields.childName.length > 2 && fields.parentName.length > 2) {
  //       setIsCurrentStepDataFilled(true);
  //     } else {
  //       setIsCurrentStepDataFilled(false);
  //     }
  //   } else if (currentStep === 2) {
  //     if (selectedDemoType === 'solo') {
  //       if (
  //         selectedOneToOneDemoTime &&
  //         selectedOneToOneDemoTime !== '' &&
  //         selectedOneToOneDemoTime !== undefined &&
  //         selectedOneToOneDemoTime !== 'undefined'
  //       ) {
  //         console.log('condition running', selectedOneToOneDemoTime);
  //         setIsCurrentStepDataFilled(true);
  //         return;
  //       } else {
  //         setIsCurrentStepDataFilled(false);
  //       }
  //     }

  //     if (selectedDemoType === 'group' && selectedSlot) {
  //       setIsCurrentStepDataFilled(true);
  //     }
  //   }
  // }, [
  //   fields,
  //   selectedSlot,
  //   selectedDemoType,
  //   selectedOneToOneDemoTime,
  //   currentStep,
  //   dispatch,
  // ]);

  // console.log('Current Step is', currentStep);
  /**
   * Check if any field is not empty
   */
  const isActive = useMemo(() => {
    if (!fields.parentName || !fields.childName || !childAge) {
      return false;
    }

    return true;
  }, [fields.childName, fields.parentName, childAge]);

  const onLayoutChange = event => {
    setGutter(event.nativeEvent.layout.y + event.nativeEvent.layout.height);
  };

  const handleChangeValue = e => {
    const {name, value} = e;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setFields(preVal => ({...preVal, [name]: value}));
    }
  };

  const handleOnClose = () => setOpen(false);

  const handleDemoSlots = async () => {
    const formFields = {...fields, phone, childAge};
    navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  };

  const handleChildAge = childAge => {
    setChildAge(childAge);
  };

  const onChangeOpen = () => setOpen(true);

  const btnNextStyle = ({pressed}) => [
    styles.btnNext,
    {
      opacity: pressed ? 0.8 : 1,
      backgroundColor: !isActive ? '#eaeaea' : COLORS.pgreen,
    },
  ];

  const checkFirstStepData = () => {
    console.log(
      'childName: ' + fields.childName,
      'parentname',
      fields.parentName,
      ' childAge',
      childAge,
    );
    if (!fields?.childName?.length || fields?.childName?.length < 3) {
      Showtoast({text: 'Enter Valid Child name', toast});
      return false;
    } else if (!fields?.parentName?.length || fields?.parentName?.length < 3) {
      Showtoast({text: 'Enter Valid Parent name', toast});
      return false;
    } else if (!childAge) {
      Showtoast({text: 'Please Select Child age', toast});
      console.log('childAge: ', childAge);
      return false;
    } else {
      return true;
    }
  };

  const checkSecondStepData = () => {
    if (selectedDemoType === 'solo') {
      if (
        selectedOneToOneDemoTime &&
        selectedOneToOneDemoTime !== '' &&
        selectedOneToOneDemoTime !== undefined &&
        selectedOneToOneDemoTime !== 'undefined'
      ) {
        console.log('condition running', selectedOneToOneDemoTime);
        return true;
      } else {
        Showtoast({text: 'Please Select Date', toast, type: 'warning'});
        return false;
      }
    }

    if (selectedDemoType === 'group' && selectedSlot) {
      return true;
    }
  };

  const handleNextBtnClick = () => {
    if (currentStep === 1) {
      if (!checkFirstStepData()) {
        return;
      }
      setCurrentStep(currentStep + 1);
      dispatch(
        setChildData({
          childName: fields.childName,
          parentName: fields.parentName,
          childAge: 7,
        }),
      );
    } else if (currentStep === 2) {
      if (!checkSecondStepData()) {
        return;
      }
      if (selectedDemoType === 'solo') {
        handleBookOneToOneDemo();
        return;
      }
      // dispatch(changebookingCreatedSuccessfully(true));
      handleBookNow();
    } else {
      console.log('Changing 4');
      setCurrentStep(1);
    }
  };

  useEffect(() => {
    if (currentStep == 1 && childData) {
      setFields({
        parentName: childData.parentName,
        childName: childData.childName,
      });
      setChildAge(childData.childAge);
      console.log('Changing 1');
      setCurrentStep(2);
    }
    if (!childData) {
      setFields({
        parentName: '',
        childName: '',
      });
      setChildAge(null);
    }
    if (bookingCreatedSuccessfully) {
      Showtoast({text: 'Booking Created Successfully', toast, type: 'success'});
      dispatch(startGetAllBookings(user?.phone));
      setCurrentStep(3);
    }
  }, [childData, bookingCreatedSuccessfully]);

  handleBookNow = () => {
    console.log('running handleBook');
    const bodyData = {
      name: fields.parentName,
      childAge: childAge || 7,
      phone,
      childName: fields.childName,
      timeZone: timezone,
      demoDate: selectedSlot.demoDate,
      bookingType: 'direct',
      source: 'app',
      course: 'Eng_Hw',
      digits: 'na',
      slotId: selectedSlot.slotId,
      country: ipData.country_name.toUpperCase(),
      countryCode: ipData.calling_code,
    };
    console.log('body data is', bodyData);
    dispatch(setNewBookingStart({data: bodyData}));
  };

  const handleBookOneToOneDemo = () => {
    //   {
    //     "demoDate": "2024-01-17T14:00:43.098Z",
    //     "childAge": 5,
    //     "childName": "abc",
    //     "courseId": "Eng_Hw",
    //     "parentName": "test",
    //     "phone": 7983068672,
    //     "countryCode": 91,
    //     "timeZone": 5.5,
    //     "leadId": 105099,
    //     "country": "India",
    //     "source": "app"
    // }

    let countryCode = ipData?.calling_code;
    if (countryCode?.charAt(0) == '+') {
      countryCode = countryCode.slice(1);
    }
    countryCode = parseInt(countryCode);
    console.log('countryCode', countryCode);

    let body = {
      parentName: fields.parentName,
      childAge,
      phone,
      childName: fields.childName,
      timeZone: timezone,
      demoDate: selectedOneToOneDemoTime,
      source: 'app',
      courseId: courseId,
      country: ipData.country_name.toUpperCase(),
      countryCode,
      leadId: 105107,
    };

    console.log('dispatching func');
    dispatch(setNewOneToOneBookingStart(body));
  };

  // console.log('selectedOneToOneDemoTime in form is', selectedOneToOneDemoTime);

  const stepPress = step => {
    console.log('step pressed', step);

    if (currentStep == 2) {
      if (step?.step == 1) {
        setCurrentStep(1);
      }
    }
    return;
  };

  const resetForm = () => {
    setCurrentStep(1);
    dispatch(setChildData(null));
  };

  const {width, height} = Dimensions.get('window');
  // console.log('place is', place);

  return (
    <View
      className="flex-1 items-center justify-center w-full h-full"
      style={{height: place ? height - 190 : height - 70}}>
      <View
        className="w-full flex-1 rounded-lg items-center overflow-hidden pb-[70px]"
        // style={{backgroundColor: darkMode ? bgSecondaryColor : '#b0b6ef30'}}
      >
        <Text
          className={`font-semibold text-center w-full p-2 justify-center`}
          // style={{backgroundColor: textColors.textYlMain, color: 'white'}}
          style={[FONTS.heading, {color: textColors.textYlMain}]}>
          Book free Handwriting Class
        </Text>

        <View
          className="p-2 my-2 w-full items-start rounded-md"
          style={{backgroundColor: bgSecondaryColor}}>
          <View className="flex-row items-center">
            <CheckBox
              disabled={false}
              value={selectedDemoType === 'group'}
              tintColors={{
                true: textColors.textYlMain,
                false: textColors.textSecondary,
              }}
              onValueChange={() => setSelectedDemoType('group')}
            />
            <View className="flex-row flex-1 flex-wrap items-center">
              <Text
                className={`text-[12px]`}
                style={[
                  {color: textColors.textYlMain, fontFamily: FONTS.primaryFont},
                ]}>
                Group Demo:
              </Text>
              <Text
                className="text-[12px]"
                style={{
                  color: textColors.textSecondary,
                  fontFamily: FONTS.primaryFont,
                }}>
                Demo conducted with a group of 5-10 Students
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <CheckBox
              disabled={false}
              value={selectedDemoType === 'solo'}
              tintColors={{
                true: textColors.textYlMain,
                false: textColors.textSecondary,
              }}
              onValueChange={() => setSelectedDemoType('solo')}
            />
            <View className="flex-row flex-1 flex-wrap items-center ">
              <Text
                className={`text-[12px]`}
                style={{
                  color: textColors.textYlMain,
                  fontFamily: FONTS.primaryFont,
                }}>
                One To One Demo:
              </Text>
              <Text
                className="text-[12px] "
                style={{
                  color: textColors.textSecondary,
                  fontFamily: FONTS.primaryFont,
                }}>
                Demo conducted 1-1 only
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full py-2 items-center">
          <Text
            className="text-[17px] font-semibold text-start w-full"
            style={[FONTS.subHeading, {color: textColors.textSecondary}]}>
            Steps To Book
          </Text>
          <View className="flex-row py-2  w-[100%] justify-between ">
            {bookingSteps?.map((step, i) => {
              return (
                <Pressable
                  className="flex flex-row items-center w-[32%]"
                  key={i}>
                  <View
                    className="flex flex-row items-center gap-1 w-full"
                    key={i}>
                    <View
                      className="h-6 w-6 items-center justify-center"
                      style={[
                        {borderRadius: 50},
                        currentStep === step.step
                          ? {backgroundColor: textColors.textYlMain}
                          : {backgroundColor: 'gray'},
                      ]}>
                      <Text
                        className="text-white text-center w-full"
                        style={[{fontFamily: FONTS.primaryFont}]}>
                        {step?.step}
                      </Text>
                    </View>
                    <Text
                      className="flex-wrap w-[80%] font-semibold text-[12px]"
                      style={[
                        currentStep === step.step
                          ? {color: textColors.textYlMain}
                          : {color: textColors.textSecondary},
                        {fontFamily: FONTS.headingFont},
                      ]}>
                      {step.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="w-[95%] items-center">
          {currentStep === 1 ? (
            <FirstStepDetails
              phone={phone}
              fields={fields}
              handleChangeValue={handleChangeValue}
              handleChildAge={handleChildAge}
            />
          ) : currentStep === 2 ? (
            selectedDemoType === 'solo' ? (
              <OneToOneDemoBook
                navigation={navigation}
                formData={{...fields, phone, childAge}}
                courseId={courseId}
                selectedDemoType={selectedDemoType}
              />
            ) : (
              <BookDemoSlots
                navigation={navigation}
                formData={{...fields, phone, childAge}}
                courseId={courseId}
                selectedDemoType={selectedDemoType}
              />
            )
          ) : currentStep === 3 ? (
            <ThirdStpDetails
              navigation={navigation}
              setCurrentStep={setCurrentStep}
              setSelectedTab={setSelectedTab}
              place={place}
            />
          ) : (
            <FirstStepDetails />
          )}
        </View>

        {currentStep !== 3 && (
          <View className="flex-row justify-around p-1 absolute bottom-0 w-full items-center h-[70px]">
            <Pressable
              className="rounded-full w-[45%] items-center border"
              style={{borderColor: textColors.textYlMain}}
              onPress={resetForm}>
              <Text
                className="text-xl p-2"
                style={{
                  color: textColors.textYlMain,
                  fontFamily: FONTS.primaryFont,
                }}>
                Reset
              </Text>
            </Pressable>

            {/* {console.log('booking loading', loading?.bookingLoading)} */}
            <TouchableOpacity
              className="rounded-full w-[45%] items-center flex-row justify-center"
              style={{
                backgroundColor: textColors.textYlMain,
              }}
              // disabled={!isCurrentStepDataFilled}
              onPress={() => handleNextBtnClick()}>
              <Text
                className="text-white text-xl p-2"
                style={{fontFamily: FONTS.primaryFont}}>
                Next
              </Text>
              {/* {console.log('booking loading', loading?.bookingLoading)} */}
              {loading?.bookingLoading && (
                <ActivityIndicator size="small" color="white" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default BookDemoScreen;

const FirstStepDetails = ({
  fields,
  phone,
  handleChangeValue,
  handleChildAge,
}) => {
  const {textColors, bgSecondaryColor, bgColor, darkMode} = useSelector(
    state => state.appTheme,
  );

  const ageArray = [
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
    {label: '9', value: 9},
    {label: '10', value: 10},
    {label: '11', value: 11},
    {label: '12', value: 12},
    {label: '13', value: 13},
    {label: '14', value: 14},
  ];

  return (
    <>
      {/* <View className="w-full p-2">
        <View className="flex-row items-center gap-1">
          <MIcon
            name="play"
            size={20}
            color={darkMode ? textColors.textYlMain : textColors.textPrimary}
          />
          <Text
            className="text-[18px]"
            style={{
              color: darkMode ? textColors.textYlMain : textColors.textPrimary,
            }}>
            Your Phone number
          </Text>
        </View>
        <Text
          placeholder="Phone Number"
          className="border rounded p-2 mt-2 text-[18px]"
          style={{
            borderColor: textColors.textSecondary,
            color: textColors.textSecondary,
          }}>
          {`${country.callingCode} ${phone}`}
        </Text>
        {/* <TextInput placeholder="Phone Number" value={} className="border-b p-1 mt-1" style={{borderColor:textColors.textSecondary}}/> */}
      {/* </View> */}

      {/* <View className="w-full p-2 mt-4">
        <View className="flex-row items-center gap-1">
          <MIcon
            name="play"
            size={20}
            color={darkMode ? textColors.textYlMain : textColors.textPrimary}
          />
          <Text
            className="text-[18px]"
            style={{
              color: darkMode ? textColors.textYlMain : textColors.textPrimary,
            }}>
            Parent Name
          </Text>
        </View>
        <TextInput
          placeholder=""
          className="border rounded p-2 mt-2 text-[18px]"
          style={{
            borderColor: textColors.textSecondary,
            color: textColors.textPrimary,
          }}
          value={fields.parentName}
          onChangeText={e => handleChangeValue({name: 'parentName', value: e})}
        />
      </View>

      <View className="w-full p-2 mt-4">
        <View className="flex-row items-center gap-1">
          <MIcon
            name="play"
            size={20}
            color={darkMode ? textColors.textYlMain : textColors.textPrimary}
          />
          <Text
            className="text-[18px]"
            style={{
              color: darkMode ? textColors.textYlMain : textColors.textPrimary,
            }}>
            Child Name
          </Text>
        </View>
        <TextInput
          placeholder=""
          className="border rounded p-2 mt-2 text-[18px]"
          style={{
            borderColor: textColors.textSecondary,
            color: textColors.textPrimary,
          }}
          value={fields.childName}
          onChangeText={e => handleChangeValue({name: 'childName', value: e})}
        />
      </View>

      <View className="w-full p-2 mt-4">
        <View className="flex-row items-center gap-1">
          <MIcon
            name="play"
            size={20}
            color={darkMode ? textColors.textYlMain : textColors.textPrimary}
          />
          <Text
            className="text-[18px]"
            style={{
              color: darkMode ? textColors.textYlMain : textColors.textPrimary,
            }}>
            Select Child Age
          </Text>
        </View>
        <TextInput
          placeholder=""
          className="border rounded p-2 mt-2 text-[18px]"
          style={{borderColor: textColors.textSecondary}}
        />
      </View> */}

      <View className="relative w-[100%] border border-gray-400 mt-4 rounded-[10px] py-3 flex-row justify-between px-2 items-center">
        <Text
          className="absolute py-1 px-1 -top-4 left-5"
          style={{
            backgroundColor: bgColor,
            color: textColors.textSecondary,
            fontSize: 14,
            fontFamily: FONTS.primaryFont,
          }}>
          Your Phone Number
        </Text>
        <Text className="text-[17px]" style={{color: textColors.textPrimary}}>
          {phone}
        </Text>
      </View>

      <View className="my-1"></View>

      <Input
        placeHolder="Enter Your Child Name"
        setValue={e => {
          handleChangeValue({name: 'childName', value: e});
        }}
        value={fields.childName}
      />
      <View className="my-1"></View>

      <Input
        placeHolder="Enter Parent Name"
        setValue={e => {
          handleChangeValue({name: 'parentName', value: e});
        }}
        value={fields.parentName}
      />

      <DropdownComponent
        data={ageArray}
        placeHolder="Select Child Age"
        setSelectedValue={handleChildAge}
      />
    </>
  );
};

const ThirdStpDetails = ({
  navigation,
  setCurrentStep,
  setSelectedTab,
  place,
}) => {
  const {textColors} = useSelector(state => state.appTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changebookingCreatedSuccessfully(false));
  }, []);

  const bookAnotherClass = () => {
    console.log('booking another class');
    dispatch(setChildData(null));
    console.log('Changing 5');
    setCurrentStep(1);
  };

  return (
    <>
      <View className="flex-col  items-center mt-5 p-3 py-4">
        <MIcon name="check-circle" size={60} color={textColors.textYlGreen} />
        <View className="flex-row items-center">
          <Text
            className="mr-2 font-semibold"
            style={[FONTS.heading, {color: textColors.textPrimary}]}>
            Congratulations
          </Text>

          <MIcon
            name="party-popper"
            size={30}
            color={textColors.textYlOrange}
          />
        </View>
        <Text
          className="text-base text-center mt-3"
          style={[FONTS.subHeading, {color: textColors.textSecondary}]}>
          You have successfully booked your first free Handwriting class
        </Text>
        <View className="flex-row justify-around gap-3 mt-3">
          <Pressable
            className="rounded-full items-center mt-3 py-2 px-4"
            style={{backgroundColor: textColors.textYlGreen}}
            // onPress={()=>{navigation.navigate('MainWelcomeScreen')}}
            onPress={bookAnotherClass}>
            <Text
              className="text-base text-white"
              style={{fontFamily: FONTS.primaryFont}}>
              Book Another class
            </Text>
          </Pressable>
          {!place && (
            <Pressable
              className="rounded-full max-w-[45%] items-center mt-3 py-2 px-4"
              style={{backgroundColor: textColors.textYlOrange}}
              onPress={() => {
                // navigation.jumpTo('Pay & Enroll');
                setSelectedTab('payAndEnroll');
              }}>
              <Text
                className="text-base text-white"
                style={{fontFamily: FONTS.primaryFont}}>
                Pay and Enroll
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
};

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
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#000',
    fontSize: 18,
    letterSpacing: 1.15,
    borderBottomWidth: 1,
    color: COLORS.black,
  },
  btnNext: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCallingCode: {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },
  phoneBox: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
});

// <KeyboardAvoidingView>

{
  /* <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{height: '100%'}}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.container}>
          <View className="">
            <Text className={`text-center font-semibold text-2xl py-2`} style={{color:textColors.textYlMain}}>Book free group demo</Text>
            <View style={styles.row} className="mt-2">
              <View style={styles.phoneBox} className="flex-row gap-2 items-center">
                <MIcon name="phone" size={25} color={textColors.textPrimary}/>
                <Text
                  className="text-[20px]"
                  styles={{letterSpacing: 1}}
                  color={textColors.textSecondary}>{`${country.callingCode} ${phone}`}</Text>
              </View>
            </View>
            <Spacer />
            <Input
              inputMode="text"
              placeholder="Enter parent name"
              value={fields.parentName}
              onChangeText={e =>
                handleChangeValue({name: 'parentName', value: e})
              }
              color={textColors.textSecondary}
            />
            <Spacer />
            <Input
              inputMode="text"
              placeholder="Enter child name"
              value={fields.childName}
              onChangeText={e =>
                handleChangeValue({name: 'childName', value: e})
              }
            />
            <Spacer />
            <Dropdown
              defaultValue="Select child age"
              value={childAge}
              onPress={onChangeOpen}
              open={open}
              onLayout={onLayoutChange}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={btnNextStyle}
          disabled={!isActive}
          onPress={handleDemoSlots}>
          <TextWrapper
            color={COLORS.white}
            fw="700"
            styles={{letterSpacing: 1.1}}>
            Next
          </TextWrapper>
        </Pressable>
      </View>
      {open && (
        <DropdownList
          data={ageList}
          gutter={gutter}
          currentValue={childAge}
          onClose={handleOnClose}
          onChange={handleChildAge}
        />
      )} */
}

// </KeyboardAvoidingView>
