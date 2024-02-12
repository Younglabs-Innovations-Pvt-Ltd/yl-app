import React, {useState, useEffect} from 'react';
import {
  View,
  Pressable,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Input from '../components/CustomInputComponent';

import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BookDemoSlots from './book-demo-slots.screen';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {
  changebookingCreatedSuccessfully,
  setChildData,
  setNewBookingStart,
  setNewOneToOneBookingStart,
  startFetchingIpData,
} from '../store/book-demo/book-demo.reducer';
import {current} from '@reduxjs/toolkit';
import DropdownComponent from '../components/DropdownComponent';
import OneToOneDemoBook from '../components/demoComponents/OneToOneDemoBook';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {FONTS} from '../utils/constants/fonts';
import {authSelector} from '../store/auth/selector';
import {startGetAllBookings} from '../store/welcome-screen/reducer';
import ModalComponent from '../components/modal.component';
import {Button} from 'react-native-share';
import {AddChildModule} from '../components/MainScreenComponents/AddChildModule';
import {userSelector} from '../store/user/selector';
import {useNavigation} from '@react-navigation/native';

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

const BookDemoScreen = ({courseId, setSelectedTab, place, courseData}) => {
  const toast = useToast();
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [childAge, setChildAge] = useState(null);
  const [fields, setFields] = useState(INITIAL_sTATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCurrentStepDataFilled, setIsCurrentStepDataFilled] = useState(false);
  const [selectedDemoType, setSelectedDemoType] = useState('solo');
  const [showAddChildView, setShowAddChildView] = useState(false);
  const {textColors, bgSecondaryColor, bgColor, darkMode} = useSelector(
    state => state.appTheme,
  );

  const navigation = useNavigation();
  const {
    timezone,
    selectedSlot,
    ipData,
    bookingCreatedSuccessfully,
    loading,
    selectedOneToOneDemoTime,
  } = useSelector(bookDemoSelector);

  const {user} = useSelector(authSelector);

  const phone = user?.phone;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.fullName && user?.fullName?.length > 2) {
      setFields(preVal => ({...preVal, parentName: user?.fullName}));
    }
  }, [user]);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  useEffect(() => {
    setIsCurrentStepDataFilled(false);
  }, [currentStep]);

  const handleChangeValue = e => {
    const {name, value} = e;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setFields(preVal => ({...preVal, [name]: value}));
    }
  };

  const handleChildAge = childAge => {
    setChildAge(childAge);
  };

  const checkFirstStepData = () => {
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

  const handleBookNow = () => {
    console.log('field are in group', fields);
    const bodyData = {
      name: fields.parentName,
      childAge: childAge,
      phone,
      childName: fields.childName,
      timeZone: timezone,
      demoDate: selectedSlot.demoDate,
      bookingType: 'direct',
      source: 'app',
      course: courseId,
      digits: 'na',
      slotId: selectedSlot.slotId,
      country: ipData.country_name.toUpperCase(),
      countryCode: ipData.calling_code,
    };
    dispatch(setNewBookingStart({data: bodyData}));
  };

  const handleBookOneToOneDemo = () => {
    console.log('fields are in solo', fields);
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

    dispatch(setNewOneToOneBookingStart(body));
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
          childAge,
        }),
      );

      console.log('child data is', {
        childName: fields.childName,
        parentName: fields.parentName,
        childAge,
      });
    } else if (currentStep === 2) {
      if (!checkSecondStepData()) {
        return;
      }
      console.log('fields in 2nd step: ', fields);
      if (selectedDemoType === 'solo') {
        handleBookOneToOneDemo();
        return;
      }
      handleBookNow();
    } else {
      console.log('Changing 4');
      setCurrentStep(1);
    }
  };

  useEffect(() => {
    if (bookingCreatedSuccessfully) {
      setCurrentStep(3);
      setTimeout(() => {
        navigation.navigate('MainWelcomeScreen');
      }, 1000);
    }
  }, [bookingCreatedSuccessfully]);

  const stepPress = step => {
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

  return (
    <View
      className="flex-1 items-center justify-center w-full h-full"
      style={{height: place ? height - 190 : height - 130}}>
      <View className="w-full flex-1 rounded-lg items-center overflow-hidden pb-[70px]">
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
              setFields={setFields}
              setShowAddChildView={setShowAddChildView}
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
                courseData={courseData}
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

      <ModalComponent
        visible={showAddChildView}
        onRequestClose={() => setShowAddChildView(false)}
        animationType="fade"
        duration={10}>
        <View
          className="bg-[#1312125c] relative z-50"
          style={{height: height + 15, width}}>
          <View className="flex-1 absolute bottom-0 pb-10 w-full bg-white p-3 rounded h-[450px]">
            <AddChildModule />
          </View>
        </View>
      </ModalComponent>
    </View>
  );
};

export default BookDemoScreen;

const FirstStepDetails = ({
  fields,
  phone,
  handleChangeValue,
  handleChildAge,
  setFields,
  setShowAddChildView,
}) => {
  const {textColors, bgColor} = useSelector(state => state.appTheme);
  const {children, currentChild} = useSelector(userSelector);

  const [childList, setChildList] = useState([]);
  const [defaultChild, setDefaultChild] = useState([]);

  useEffect(() => {
    if (children?.length > 0) {
      let arr = [];
      children.forEach(element => {
        arr.push({label: element.name, value: element});
      });
      setChildList(arr);
    } else {
      setChildList([{label: 'No Child added. Add One', value: 'addChild'}]);
    }
  }, [children]);

  useEffect(() => {
    if (currentChild) {
      const elem = [{label: currentChild.name, value: currentChild}];
      const {name, age} = currentChild;
      setFields(pre => ({...pre, childName: name}));
      handleChildAge(age);
      setDefaultChild(name);
    }
  }, [currentChild]);

  const handleSelectChild = child => {
    if (!child) {
      return;
    }
    if (child === 'addChild') {
      setShowAddChildView(true);
      return;
    }
    const {name, age} = child;
    console.log(name, age);

    setFields(pre => ({...pre, childName: name}));
    handleChildAge(age);
  };

  return (
    <>
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
      {childList && (
        <DropdownComponent
          data={childList}
          placeHolder="Select Child"
          setSelectedValue={handleSelectChild}
          defaultValue={defaultChild}
        />
      )}

      <Input
        placeHolder="Enter Parent Name"
        setValue={e => {
          handleChangeValue({name: 'parentName', value: e});
        }}
        value={fields.parentName}
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
