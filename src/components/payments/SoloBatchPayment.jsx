import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS} from '../../utils/constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {welcomeScreenSelector} from '../../store/welcome-screen/selector';
import {authSelector} from '../../store/auth/selector';
import {makeSoloPayment} from '../../store/payment/reducer';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {FONTS} from '../../utils/constants/fonts';
import {ScrollView} from 'react-native-gesture-handler';

import {
  resetCourseDetails,
  setCurrentAgeGroup,
  setCurrentLevel,
  setCurrentSelectedBatch,
  setLevelText,
  setPrice,
  setStrikeThroughPrice,
} from '../../store/course/course.reducer';
import {courseSelector} from '../../store/course/course.selector';
import {Showtoast} from '../../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import TextWrapper from '../text-wrapper.component';
import Collapsible from 'react-native-collapsible';
import Spacer from '../spacer.component';
import Icon from '../icon.component';

// const ageGroups = ['5-7', '8-10', '11-14'];

GoogleSignin.configure({
  webClientId:
    '54129267828-73o9bu1af3djrmh0e9krbk59s1g47rsp.apps.googleusercontent.com',
});

const SoloBatchPayment = ({
  courseData,
  ipData,
  timezone,
  prices,
  navigation,
  ageGroups,
  course_type,
  levelNames,
}) => {
  const toast = useToast();
  const {textColors, bgColor, bgSecondaryColor, darkMode} = useSelector(
    state => state.appTheme,
  );
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(undefined);
  const [selectedLevelToBuy, setSelectedLevelToBuy] = useState(null);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [classCount, setClassCount] = useState(0);
  const {courseDetails} = useSelector(courseSelector);
  const [paynowLoading, setPaynowLoading] = useState(false);

  const [collapsed, setCollapsed] = useState({
    ageGroup: false,
    batch: true,
    payment: true,
    time: true,
  });

  useEffect(() => {
    if (prices?.solo) {
      const obj = {...prices.solo}; // Create a shallow copy of prices.solo
      const sortedObj = {};
      Object.entries(obj)
        .sort(([, a], [, b]) => {
          // Compare the 'level' property of objects 'a' and 'b' directly
          return a.level - b.level; // Assuming level is numeric
        })
        .forEach(([key, value]) => {
          if (value.visibility === false) {
            console.log('deleting', value);
            delete obj[key];
          } else {
            sortedObj[key] = value;
          }
        });
      setFilteredBatches(sortedObj);
    }
  }, [prices]);

  const dispatch = useDispatch();

  const getLevelName = level => {
    if (course_type === 'curriculum') {
      switch (level) {
        case 1:
          return levelNames?.level1Name;

        case 2:
          return levelNames?.level2Name;

        case 3:
          return levelNames?.level3Name;
      }
    } else {
      switch (level) {
        case 1:
          return 'Foundation';

        case 2:
          return 'Advanced';

        case 3:
          return 'Foundation+Advanced';
      }
    }
  };

  const getClasses = level => {
    if (course_type !== 'curriculum') {
      switch (level) {
        case 1:
          return 12;

        case 2:
          return 12;

        case 3:
          return 24;
      }
    } else {
      return null;
    }
  };

  const visibleDatePicker = () => setVisible(true);
  const hideDatePicker = () => setVisible(false);

  const verifyDate = date => {
    if (!date || date === '') {
      Showtoast({text: 'Please Select a date', toast, type: 'danger'});
      return;
    }

    const dateSelectd = moment(date);
    const today = moment().startOf('day');
    const tomorrow = today.clone().add(1, 'day');
    const dateToStartBatch = tomorrow.clone().add(1, 'day');

    if (dateSelectd.isBefore(tomorrow)) {
      Showtoast({
        text: 'Select date from Tomorrow onwards',
        toast,
        type: 'danger',
      });
      return false;
    }

    const differenceInDays = dateSelectd.diff(dateToStartBatch, 'days');
    console.log('difference in days is', differenceInDays);

    if (differenceInDays > 15) {
      Showtoast({
        text: 'Choose Demo date between 15 days span',
        toast,
        type: 'danger',
      });
      return false;
    }
    return true;
  };

  const setSelectedDate = date => {
    if (!verifyDate(date)) {
      hideDatePicker();
      return;
    }
    console.log('setting date is', date);
    setDate(date);
    dispatch(setCurrentSelectedBatch({startDate: date, type: 'solo'}));
    hideDatePicker();
    setCollapsed(p => ({...p, time: true, payment: false}));
  };

  const {currentAgeGroup} = useSelector(courseSelector);

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('GoogleAuthenticationError', error);
    }
  }

  const payNow = () => {
    // const ageGroup = makeAgeGroup(selectedChild.childAge);
    // const startDateTime = moment(date).format('YYYY-MM-DD HH:mm');
    setPaynowLoading(true);
    if (!currentAgeGroup || currentAgeGroup === '') {
      Showtoast({text: 'Please Select Age Group', toast, type: 'danger'});
      setPaynowLoading(false);
      return;
    }

    if (!selectedLevelToBuy) {
      Showtoast({text: 'Please Select a batch', toast, type: 'danger'});
      setPaynowLoading(false);
      return;
    }

    if (!date || date == '') {
      Showtoast({
        text: 'Please Select Your preferrable date',
        toast,
        type: 'danger',
      });
      setPaynowLoading(false);
      return;
    }

    navigation.navigate('Payment', {
      paymentBatchType: 'solo',
      paymentMethod: courseData?.paymentMethod,
      classesSold: classCount || null,
    });
    setPaynowLoading(false);
  };

  useEffect(() => {
    if (paynowLoading) {
      console.log('become true');
    }
  }, [paynowLoading]);

  const handleBatchSelect = (level, price, strikeThroughPrice) => {
    let levelText = getLevelName(level);
    dispatch(setLevelText(levelText));
    dispatch(setCurrentLevel(level));
    dispatch(setPrice(price));
    dispatch(setStrikeThroughPrice(strikeThroughPrice));
    if (courseDetails?.course_type == 'curriculum') {
      let classes = levelText.split(' ')[0];
      classes = parseInt(classes);
      if (isNaN(classes)) {
        return;
      } else {
        setClassCount(classes);
      }
    }

    setSelectedLevelToBuy({
      level: level,
      price: price,
    });

    setCollapsed(p => ({...p, batch: true, time: false}));
  };

  const handleAgeGroup = group => {
    dispatch(setCurrentAgeGroup(group));
    setCollapsed(p => ({...p, ageGroup: true, batch: false}));
  };

  return (
    <ScrollView style={{flex: 1}} className="flex-1">
      <View className="flex-1">
        <View className="flex-1">
          <View className="px-2">
            <Text
              className="text-xl font-semibold text-center"
              style={[FONTS.heading, {color: textColors.textYlMain}]}>
              Dedicated attention to your child in our one-to-one batches
            </Text>
            <Text
              className="text-base mt-2 text-center"
              style={{
                color: textColors.textSecondary,
                fontFamily: FONTS.primaryFont,
              }}>
              Select timings according to your schedule and avoid missing any
              classes
            </Text>
          </View>

          <View className="py-4 rounded mt-5" style={{paddingBottom: 16}}>
            <View className="">
              {/* <Text
                className="text-center w-full font-semibold text-xl"
                style={{
                  fontFamily: FONTS.headingFont,
                  color: textColors.textSecondary,
                }}>
                Select a batch
              </Text> */}
              {/* Select age group */}
              <View
                style={{
                  paddingHorizontal: 8,
                  backgroundColor: darkMode ? bgSecondaryColor : '#80808017',
                  paddingVertical: 12,
                  borderRadius: 4,
                }}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() =>
                    setCollapsed(p => ({...p, ageGroup: !p.ageGroup}))
                  }>
                  <TextWrapper fs={20} fw="700" color={textColors.textPrimary}>
                    1. Select age group
                  </TextWrapper>
                  {!currentAgeGroup ? (
                    <Icon
                      name={`chevron-${
                        !collapsed.ageGroup ? 'up' : 'down'
                      }-outline`}
                      size={24}
                      color={textColors.textSecondary}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle"
                      size={32}
                      color={COLORS.pblue}
                    />
                  )}
                </Pressable>
                <Collapsible duration={450} collapsed={collapsed.ageGroup}>
                  <View style={{marginVertical: 8}}>
                    <View className="flex-row px-3">
                      {ageGroups?.map((group, i) => {
                        return (
                          <Pressable
                            key={i}
                            className="flex-1 py-1 px-3 items-center justify-center mr-2 border rounded-full"
                            style={
                              currentAgeGroup === group.ageGroup
                                ? {
                                    borderColor: textColors.textYlMain,
                                    backgroundColor: textColors.textYlMain,
                                  }
                                : {
                                    borderColor: textColors.textSecondary,
                                    backgroundColor: bgSecondaryColor,
                                  }
                            }
                            onPress={() => handleAgeGroup(group?.ageGroup)}>
                            <Text
                              style={{
                                color:
                                  currentAgeGroup === group.ageGroup
                                    ? 'white'
                                    : textColors.textSecondary,
                                fontSize: 16,
                              }}>
                              {group?.ageGroup}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </Collapsible>
              </View>

              <Spacer space={4} />

              {/* Select batch */}
              <View
                style={{
                  paddingHorizontal: 8,
                  backgroundColor: darkMode ? bgSecondaryColor : '#80808017',
                  paddingVertical: 12,
                  borderRadius: 4,
                }}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setCollapsed(p => ({...p, batch: !p.batch}))}>
                  <TextWrapper fs={20} fw="700" color={textColors.textPrimary}>
                    2. Select batch
                  </TextWrapper>
                  {!selectedLevelToBuy?.level ? (
                    <Icon
                      name={`chevron-${
                        !collapsed.batch ? 'up' : 'down'
                      }-outline`}
                      size={24}
                      color={textColors.textSecondary}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle"
                      size={32}
                      color={COLORS.pblue}
                    />
                  )}
                </Pressable>
                <Collapsible duration={450} collapsed={collapsed.batch}>
                  <View
                    style={{
                      padding: 8,
                    }}>
                    {Object.values(filteredBatches).map(batch => (
                      <Pressable
                        key={batch.level}
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          gap: 4,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          backgroundColor:
                            selectedLevelToBuy?.level === batch.level
                              ? textColors.textYlMain
                              : bgSecondaryColor,
                          borderRadius: 8,
                          borderColor: textColors.textSecondary,
                          borderWidth: 1,
                          marginTop: 8,
                        }}
                        onPress={() =>
                          handleBatchSelect(
                            batch.level,
                            batch?.offer,
                            batch?.price,
                          )
                        }>
                        <View>
                          <Text
                            style={{
                              color: textColors.textPrimary,
                              fontSize: 19,
                              fontWeight: 'bold',
                            }}>
                            {getLevelName(batch.level)}
                          </Text>
                          {getClasses(batch.level) && (
                            <Text
                              style={{
                                color: textColors.textPrimary,
                                fontSize: 15,
                              }}>
                              {`${getClasses(batch.level)} classes`}
                            </Text>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            gap: 4,
                          }}>
                          <Text
                            style={{
                              color: textColors.textPrimary,
                              fontSize: 18,
                              fontWeight: 'bold',
                            }}>
                            {ipData?.currency?.symbol}
                            {batch?.offer}
                          </Text>
                          <Text
                            style={{
                              color: textColors.textSecondary,
                            }}
                            className="line-through">
                            {ipData?.currency?.symbol}
                            {batch?.price}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </Collapsible>
              </View>

              <Spacer space={4} />

              {/* Select time and date */}
              <View
                style={{
                  paddingHorizontal: 8,
                  backgroundColor: darkMode ? bgSecondaryColor : '#80808017',
                  paddingVertical: 12,
                  borderRadius: 4,
                }}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setCollapsed(p => ({...p, time: !p.time}))}>
                  <TextWrapper fs={20} fw="700" color={textColors.textPrimary}>
                    3. Select time
                  </TextWrapper>
                  {!date ? (
                    <Icon
                      name={`chevron-${
                        !collapsed.time ? 'up' : 'down'
                      }-outline`}
                      size={24}
                      color={textColors.textSecondary}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle"
                      size={32}
                      color={COLORS.pblue}
                    />
                  )}
                </Pressable>
                <Collapsible duration={450} collapsed={collapsed.time}>
                  <View style={{paddingTop: 8, alignItems: 'center'}}>
                    <Pressable
                      className="w-[90%] border-[.4px] rounded overflow-hidden"
                      style={{borderColor: textColors.textSecondary}}
                      onPress={visibleDatePicker}>
                      <View className="w-full flex-row">
                        <View className="w-[75%] justify-center px-3">
                          {date && date !== '' ? (
                            <Text
                              className=""
                              style={{color: textColors.textPrimary}}>
                              {moment(date).format('YYYY-MM-DD HH:mm')}
                            </Text>
                          ) : (
                            <Text className="w-full text-gray-400">
                              Click to select date
                            </Text>
                          )}
                        </View>
                        <View
                          className="p-2 w-[25%] items-center"
                          style={{backgroundColor: textColors.textYlMain}}>
                          <Text className="text-white">Select</Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </Collapsible>
              </View>

              <Spacer space={4} />

              {/* Pay now */}
              <View
                style={{
                  paddingHorizontal: 8,
                  backgroundColor: darkMode ? bgSecondaryColor : '#80808017',
                  paddingVertical: 12,
                  borderRadius: 4,
                }}>
                <Pressable
                  onPress={() =>
                    setCollapsed(p => ({...p, payment: !p.payment}))
                  }>
                  <TextWrapper fs={20} fw="700" color={textColors.textPrimary}>
                    4. Buy Now
                  </TextWrapper>
                </Pressable>
                <Collapsible duration={450} collapsed={collapsed.payment}>
                  <View style={{paddingTop: 8, alignItems: 'center'}}>
                    <Pressable
                      className="w-[95%] rounded py-2 items-center flex-row justify-center"
                      style={{backgroundColor: textColors.textYlMain}}
                      onPress={payNow}>
                      <Text
                        className="text-white font-semibold text-base"
                        style={{fontFamily: FONTS.primaryFont}}>
                        Buy Now
                      </Text>

                      {paynowLoading && (
                        <ActivityIndicator
                          size={20}
                          className="ml-3"
                          color={'white'}
                        />
                      )}
                    </Pressable>
                  </View>
                </Collapsible>
              </View>
            </View>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={visible}
          mode="datetime"
          onConfirm={setSelectedDate}
          onCancel={hideDatePicker}
        />
      </View>
    </ScrollView>
  );
};

export default SoloBatchPayment;

const styles = StyleSheet.create({});
