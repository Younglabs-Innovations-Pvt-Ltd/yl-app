import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import CountDown from '../countdown.component';
import Spacer from '../spacer.component';
import {COLORS} from '../../assets/theme/theme';
import {useSelector} from 'react-redux';
import BackButton from '../back-button.component';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'June',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getClassDate = seconds => {
  const date = new Date(seconds * 1000);
  const classDate = date.getDate();
  const year = date.getFullYear();
  const time = date.getHours();
  const month = date.getMonth();

  const classTime =
    time >= 12
      ? `${time === 12 ? time : time - 12} : 00 PM`
      : `${time} : 00 AM`;

  return `${classDate} ${months[month]} ${year} at ${classTime}`;
};

const DemoWaiting = ({timeLeft, handleBackButton}) => {
  const {demoData} = useSelector(state => state.joinDemo);

  if (!demoData) return;

  const {demoDate} = demoData;
  const seconds = demoDate._seconds;

  return (
    <View>
      <View style={styles.header}>
        <BackButton onPress={handleBackButton} />
      </View>
      <TextWrapper color="gray">Your free class starts in</TextWrapper>
      <CountDown timeLeft={timeLeft} />
      <Spacer />
      <View>
        <TextWrapper color="gray" fw="bold">{`Your class is on ${getClassDate(
          seconds,
        )}`}</TextWrapper>
        <TextWrapper fs={20}>Instructions:</TextWrapper>
        <View style={styles.listStyle}>
          <View style={styles.listItem}>
            <View style={styles.marker} />
            <TextWrapper fs={18}>Once timer will be ended up</TextWrapper>
          </View>
          <View style={styles.listItem}>
            <View style={styles.marker} />
            <TextWrapper fs={18}>
              Enter child name and click on join button
            </TextWrapper>
          </View>
          <View style={styles.listItem}>
            <View style={styles.marker} />
            <TextWrapper fs={18}>Wait for join class</TextWrapper>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DemoWaiting;

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.black,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    position: 'relative',
  },
  header: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
});
