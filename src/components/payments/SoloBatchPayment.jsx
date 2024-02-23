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
          return 'Foundation + Advanced';
      }
    }
  };

  const visibleDatePicker = () => setVisible(true);
  const hideDatePicker = () => setVisible(false);

  const setSelectedDate = date => {
    const dateSelectd = moment(date);
    const dateToStartBatch = moment().add(1, 'days');

    if (dateSelectd.isBefore(dateToStartBatch)) {
      console.log('select date from today onwards');
      Showtoast({
        text: 'Select date from Tomorrow onwards',
        toast,
        type: 'danger',
      });
      hideDatePicker();
      return;
    }

    const differenceInDays = dateSelectd.diff(dateToStartBatch, 'days');
    if (differenceInDays > 15) {
      Showtoast({
        text: 'Choose Demo date between 15 days span',
        toast,
        type: 'danger',
      });
      hideDatePicker();
      return;
    }

    setDate(date);
    dispatch(setCurrentSelectedBatch({startDate: date, type: 'solo'}));
    hideDatePicker();
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

  useEffect(()=>{
    if(paynowLoading){
      console.log("become true")
    }
  },[paynowLoading])

  const handleBatchSelect = (level, price, strikeThroughPrice) => {
    let levelText = getLevelName(level);
    dispatch(setLevelText(levelText));
    dispatch(setCurrentLevel(level));
    dispatch(setPrice(price));
    dispatch(setStrikeThroughPrice(strikeThroughPrice));
    console.log('i am here', courseDetails?.course_type);
    if (courseDetails?.course_type == 'curriculum') {
      let classes = levelText.split(' ')[0];
      classes = parseInt(classes);
      if (isNaN(classes)) {
        return;
      } else {
        setClassCount(classes);
      }
    }
  };

  const handleAgeGroup = group => {
    dispatch(setCurrentAgeGroup(group));
  };

  return (
    <ScrollView style={{flex: 1}} className="flex-1">
      <View className="flex-1">
        <View className="flex-1">
          <View className="px-2">
            <Text
              className="text-xl font-semibold"
              style={[FONTS.heading, {color: textColors.textYlMain}]}>
              Interact Directly with teacher One to One In our new Solo Bathes
            </Text>
            <Text
              className="text-base mt-2 text-center"
              style={{
                color: textColors.textSecondary,
                fontFamily: FONTS.primaryFont,
              }}>
              Solo Batch Offer flexible Timing, Better Learning, And Instant
              Doubt Solving
            </Text>
          </View>

          <View
            className="py-4 rounded mt-5"
            style={{
              backgroundColor: darkMode ? bgSecondaryColor : '#80808017',
            }}>
            <View className="">
              <Text
                className="text-center w-full font-semibold text-xl"
                style={{
                  fontFamily: FONTS.headingFont,
                  color: textColors.textSecondary,
                }}>
                Select A batch For you
              </Text>

              <View className="w-full my-2 flex-row px-2 items-center justify-center">
                <Text style={{color: textColors.textSecondary}}>
                  Select Age Group:
                </Text>
                <View className="flex-row px-3">
                  {ageGroups?.map((group, i) => {
                    return (
                      <Pressable
                        key={i}
                        className="py-1 px-3 items-center justify-center mr-2 border rounded-full"
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
                          }}>
                          {group?.ageGroup}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="flex-row justify-around w-full mt-3">
                {Object.entries(filteredBatches).map(([key, obj]) => {
                  return (
                    <Pressable
                      className="py-2 rounded px-3 max-w-[32%] items-center"
                      style={{
                        backgroundColor:
                          selectedLevelToBuy?.level == obj.level
                            ? textColors.textYlMain
                            : bgSecondaryColor,
                      }}
                      onPress={() => {
                        handleBatchSelect(obj.level, obj?.offer, obj?.price),
                          setSelectedLevelToBuy({
                            level: obj.level,
                            price: obj?.offer,
                          });
                      }}
                      key={Math.random()}>
                      <View className="items-center justify-center flex-1">
                        <Text
                          className="font-semibold text-[16px] leading-[18px] text-center"
                          style={{
                            fontFamily: FONTS.headingFont,
                            color:
                              selectedLevelToBuy?.level == obj.level
                                ? 'white'
                                : textColors.textYlMain,
                          }}>
                          {getLevelName(obj.level)}
                        </Text>

                        <View className="flex-row">
                          <Text
                            className=""
                            style={{color: textColors.textSecondary}}>
                            {ipData?.currency?.symbol} {obj?.offer}
                          </Text>
                          <Text
                            className="line-through ml-1"
                            style={{color: textColors.textSecondary}}>
                            {obj?.price}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mt-2 w-full">
              <View className="w-full items-center mt-8">
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
              <Text
                className="mt-3 text-center w-full"
                style={{
                  color: textColors.textSecondary,
                  fontFamily: FONTS.primaryFont,
                }}>
                Choose Your Preffered Time and Date to Start Your Classes
              </Text>
            </View>
          </View>

          <View className="my-5 items-center">
            <Pressable
              className="w-[95%] rounded py-2 items-center flex-row justify-center"
              style={{backgroundColor: textColors.textYlMain}}
              onPress={payNow}>
              <Text
                className="text-white font-semibold text-base"
                style={{fontFamily: FONTS.primaryFont}}>
                Buy Now
              </Text>

              {paynowLoading && <ActivityIndicator size={20} className="ml-3" color={'white'} />}
            </Pressable>
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
