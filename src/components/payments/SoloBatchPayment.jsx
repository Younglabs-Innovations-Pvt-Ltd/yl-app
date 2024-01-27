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

const ageGroups = ['5-7', '8-10', '11-14'];

GoogleSignin.configure({
  webClientId:
    '54129267828-73o9bu1af3djrmh0e9krbk59s1g47rsp.apps.googleusercontent.com',
});

const SoloBatchPayment = ({courseData, ipData, timezone, prices}) => {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState('');

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

    const levelPrice = prices['solo']['level1'];

    const startDateTime = moment(date).format('YYYY-MM-DD HH:mm');

    const body = {
      courseType: 'solo',
      leadId: selectedChild.leadId,
      ageGroup: ageGroup,
      courseId: courseData.id,
      FCY: `${ipData?.currency?.code} ${levelPrice.offer}`,
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
      price: levelPrice.offer,
    };

    console.log(body);
    dispatch(makeSoloPayment({body}));
  };

  return (
    <View style={{flex: 1}}>
      <Pressable
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
      </Pressable>
      <DateTimePickerModal
        isVisible={visible}
        mode="datetime"
        onConfirm={setSelectedDate}
      />
    </View>
  );
};

export default SoloBatchPayment;

const styles = StyleSheet.create({});
