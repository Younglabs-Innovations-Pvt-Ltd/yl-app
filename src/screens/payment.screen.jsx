import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, View, ScrollView, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../utils/constants/colors';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import {courseSelector} from '../store/course/course.selector';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {makePayment, setLoading} from '../store/course/course.reducer';

const Payment = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    if (currentSelectedBatch) {
      const date = new Date(currentSelectedBatch.startDate._seconds * 1000);
      const dateAndTime = moment(date).format('MMMM Do [at] h:mm A');
      setDateTime(dateAndTime);
    }
  }, [currentSelectedBatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [navigation]);

  const {
    currentAgeGroup,
    currentSelectedBatch,
    levelText,
    currentLevel,
    price,
    strikeThroughPrice,
    courseDetails,
    loading,
  } = useSelector(courseSelector);

  const {bookingDetails} = useSelector(joinDemoSelector);
  const {ipData} = useSelector(bookDemoSelector);

  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (!email) {
      setEmailErr('Enter your email address.');
      return;
    }

    dispatch(
      makePayment({
        price,
        strikeThroughPrice,
        currentSelectedBatch,
        levelText,
        ipData,
        bookingDetails,
        courseDetails,
        email,
      }),
    );

    setEmailErr('');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 12}}>
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700" styles={{textTransform: 'capitalize'}}>
            {bookingDetails.parentName}
          </TextWrapper>
          <Spacer space={2} />
          <TextWrapper>{bookingDetails?.phone}</TextWrapper>
        </View>
        <Spacer space={6} />
        <TextWrapper fs={20} fw="700">
          Course Details
        </TextWrapper>
        <Spacer space={4} />
        <View style={styles.card}>
          <TextWrapper fs={18} fw="700">
            Name:{' '}
            <TextWrapper fs={18} fw="600">
              English Handwriting
            </TextWrapper>
          </TextWrapper>
          <Spacer space={6} />
          <TextWrapper fs={18} fw="700">
            Level:{' '}
            <TextWrapper fs={18} fw="600">
              {levelText}
            </TextWrapper>
          </TextWrapper>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon name="book-variant" size={26} color={COLORS.black} />
            <TextWrapper fs={18}>
              Total Classess:{' '}
              {currentLevel === 1 || currentLevel === 2 ? 12 : 24}
            </TextWrapper>
          </View>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon name="cake-variant" size={26} color={COLORS.black} />
            <TextWrapper fs={18}>For Ages: {currentAgeGroup}</TextWrapper>
          </View>
          <Spacer space={6} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <MIcon name="calendar-month" size={26} color={COLORS.black} />
            <TextWrapper fs={18}>Start date: {dateTime}</TextWrapper>
          </View>
        </View>
        <Spacer space={4} />
        <View style={styles.card}>
          <TextInput
            placeholder="Enter email"
            style={styles.emailInput}
            textContentType="emailAddress"
            autoCorrect={false}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            value={email}
            onChangeText={e => setEmail(e)}
          />
          {emailErr && (
            <TextWrapper fs={14} color={COLORS.pred}>
              {emailErr}
            </TextWrapper>
          )}
        </View>
      </ScrollView>
      <View style={{padding: 12}}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextWrapper fs={18}>Total</TextWrapper>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <TextWrapper
                fs={20}>{`${ipData?.currency.symbol}${price}`}</TextWrapper>
              <TextWrapper
                styles={{textDecorationLine: 'line-through'}}
                fs={
                  17
                }>{`${ipData?.currency.symbol}${strikeThroughPrice}`}</TextWrapper>
            </View>
          </View>
          <Spacer space={4} />
          <Pressable
            onPress={handleCheckout}
            style={({pressed}) => [
              styles.btnCheckout,
              {
                opacity: pressed ? 0.8 : 1,
                backgroundColor: loading ? '#3AAF1E' : COLORS.pgreen,
              },
            ]}
            disabled={loading}>
            <TextWrapper fs={18} fw="700" color={COLORS.white}>
              Checkout
            </TextWrapper>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    width: '100%',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  btnCheckout: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});
