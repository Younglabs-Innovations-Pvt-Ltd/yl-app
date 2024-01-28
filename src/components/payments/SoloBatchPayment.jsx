import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
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

const ageGroups = ['5-7', '8-10', '11-14'];

GoogleSignin.configure({
  webClientId:
    '54129267828-73o9bu1af3djrmh0e9krbk59s1g47rsp.apps.googleusercontent.com',
});

const SoloBatchPayment = ({courseData, ipData, timezone, prices}) => {
  const {textColors, bgColor, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(undefined);
  const [selectedLevelToBuy, setSelectedLevelToBuy] = useState(null);

  const {selectedChild} = useSelector(welcomeScreenSelector);
  const {user} = useSelector(authSelector);

  const dispatch = useDispatch();

  const visibleDatePicker = () => setVisible(true);
  const hideDatePicker = () => setVisible(false);

  const setSelectedDate = date => {
    hideDatePicker();
    setDate(date);
  };

  const makeAgeGroup = age => {
    return ageGroups.find(group => {
      const maxAge = group.split('-')[1];
      const minAge = group.split('-')[0];
      if (age >= parseInt(minAge) && age <= parseInt(maxAge)) return group;
    });
  };

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
    const ageGroup = makeAgeGroup(selectedChild.childAge);
    const startDateTime = moment(date).format('YYYY-MM-DD HH:mm');

    const body = {
      courseType: 'solo',
      leadId: selectedChild.leadId,
      ageGroup: ageGroup,
      courseId: courseData.id,
      FCY: `${ipData?.currency?.code} ${selectedLevelToBuy.price}`,
      promisedStartDate: startDateTime,
      promisedBatchFrequency: null,
      phone: selectedChild.phone,
      fullName: 'shobhit', // TODO: this should be from user
      batchId: null,
      childName: selectedChild.childName,
      email: 'shobhitsaini709@gmail.com',
      childAge: selectedChild.childAge,
      timezone,
      countryCode: selectedChild.countryCode, // TODO: this should be from user
      source: 'app',
      batchType: 'unhandled',
      startDate: startDateTime,
      price: selectedLevelToBuy?.price,
    };

    console.log(body);
    dispatch(makeSoloPayment({body}));
  };

  console.log('selectd level to purchase', selectedLevelToBuy);

  return (
    <ScrollView style={{flex: 1}} className="">
      <View>
        {/* <Pressable
        style={{
          padding: 12,
          alignItems: 'center',
          backgroundColor: COLORS.pblue,
          borderRadius: 8,
        }}
        onPress={visibleDatePicker}>
        <Text style={{fontSize: 16, color: COLORS.white}}>
          Select class date and time
        </Text>
      </Pressable>
      <Pressable
        style={{
          padding: 12,
          alignItems: 'center',
          backgroundColor: COLORS.pblue,
          borderRadius: 8,
          marginTop: 16,
        }}
        onPress={payNow}>
        <Text style={{fontSize: 16, color: COLORS.white}}>Buy now</Text>
      </Pressable>

      <Pressable
        style={{
          padding: 12,
          alignItems: 'center',
          backgroundColor: COLORS.pblue,
          borderRadius: 8,
          marginTop: 16,
        }}
        onPress={onGoogleButtonPress}>
        <Text style={{fontSize: 16, color: COLORS.white}}>Google login</Text>
      </Pressable> */}

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
            style={{backgroundColor: bgSecondaryColor}}>
            <View className="">
              <Text
                className="text-center w-full font-semibold text-xl"
                style={{
                  fontFamily: FONTS.headingFont,
                  color: textColors.textSecondary,
                }}>
                Select A batch For you
              </Text>

              <View className="flex-row justify-around w-full mt-3">
                <Pressable
                  className="p-1 border-2 rounded px-3"
                  style={{
                    borderColor:
                      selectedLevelToBuy?.level == 1
                        ? textColors.textYlMain
                        : textColors.textSecondary,
                  }}
                  onPress={() =>
                    setSelectedLevelToBuy({
                      level: 1,
                      price: prices?.solo?.level1?.offer,
                    })
                  }>
                  <View className=" items-center justify-center">
                    <Text
                      className="font-semibold text-base"
                      style={{
                        fontFamily: FONTS.headingFont,
                        color: textColors.textYlMain,
                      }}>
                      Foundation
                    </Text>
                    <Text
                      className="text-xs"
                      style={{color: textColors.textSecondary}}>
                      (12 classes)
                    </Text>

                    {/* {console.log("ipdata is", ipData)} */}
                    <View className="flex-row">
                      <Text
                        className=""
                        style={{color: textColors.textSecondary}}>
                        {ipData?.currency?.symbol} {prices?.solo?.level1?.offer}
                      </Text>
                      <Text
                        className="line-through ml-1"
                        style={{color: textColors.textSecondary}}>
                        {prices?.solo?.level1?.price}
                      </Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  className="p-1 border-2 rounded px-3"
                  style={{
                    borderColor:
                      selectedLevelToBuy?.level == 2
                        ? textColors.textYlMain
                        : textColors.textSecondary,
                  }}
                  onPress={() =>
                    setSelectedLevelToBuy({
                      level: 2,
                      price: prices?.solo?.level2?.offer,
                    })
                  }>
                  <View
                    className="items-center justify-center"
                    style={{borderColor: textColors.textSecondary}}>
                    <Text
                      className="font-semibold text-base"
                      style={{
                        fontFamily: FONTS.headingFont,
                        color: textColors.textYlRed,
                      }}>
                      Advanced
                    </Text>
                    <Text
                      className="text-xs"
                      style={{color: textColors.textSecondary}}>
                      (12 classes)
                    </Text>

                    {/* {console.log("ipdata is", ipData)} */}
                    <View className="flex-row">
                      <Text
                        className=""
                        style={{color: textColors.textSecondary}}>
                        {ipData?.currency?.symbol} {prices?.solo?.level2?.offer}
                      </Text>
                      <Text
                        className="line-through ml-1"
                        style={{color: textColors.textSecondary}}>
                        {prices?.solo?.level2?.price}
                      </Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  className="p-1 border-2 rounded px-3 max-w-[33%]"
                  style={{
                    borderColor:
                      selectedLevelToBuy?.level == 'combo'
                        ? textColors.textYlMain
                        : textColors.textSecondary,
                  }}
                  onPress={() =>
                    setSelectedLevelToBuy({
                      level: 'combo',
                      price: prices?.solo?.combo?.offer,
                    })
                  }>
                  <View
                    className="items-center"
                    style={{borderColor: textColors.textSecondary}}>
                    <Text
                      className="font-semibold text-base flex-wrap text-center leading-5"
                      style={{
                        fontFamily: FONTS.headingFont,
                        color: textColors.textYlGreen,
                      }}>
                      Foundation + Advanced
                    </Text>
                    <Text
                      className="text-xs"
                      style={{color: textColors.textSecondary}}>
                      (12 classes)
                    </Text>

                    {/* {console.log("ipdata is", ipData)} */}
                    <View className="flex-row">
                      <Text
                        className=""
                        style={{color: textColors.textSecondary}}>
                        {ipData?.currency?.symbol} {prices?.solo?.combo?.offer}
                      </Text>
                      <Text
                        className="line-through ml-1"
                        style={{color: textColors.textSecondary}}>
                        {prices?.solo?.combo?.price}
                      </Text>
                    </View>
                  </View>
                </Pressable>
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
                          Click to select data
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
                className="mt-3"
                style={{
                  color: textColors.textSecondary,
                  fontFamily: FONTS.primaryFont,
                }}>
                Choose Your Preffered Time and Date to Start Your Classes
              </Text>
              {/* <View className="flex-row">
            <Text
              className="font-semibold"
              style={{color: textColors.textSecondary}}>
              Note:
            </Text>
          </View> */}
            </View>
          </View>

          <View className="mt-5 items-center">
            <Pressable
              className="w-[95%] rounded py-2 items-center"
              style={{backgroundColor: textColors.textYlMain}}
              onPress={payNow}
              >
              <Text
                className="text-white font-semibold text-base"
                style={{fontFamily: FONTS.primaryFont}}>
                Buy Now
              </Text>
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
