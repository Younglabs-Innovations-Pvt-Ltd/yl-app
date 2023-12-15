import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import CountDown from '../countdown.component';
import Spacer from '../spacer.component';
import {COLORS} from '../../utils/constants/colors';
import {useSelector} from 'react-redux';
import {i18nContext} from '../../context/lang.context';
import UploadHandwriting from '../upload-handwriting.component';

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

const {width: deviceWidth} = Dimensions.get('window');

const getClassDate = seconds => {
  const date = new Date(seconds * 1000);
  const classDate = date.getDate();
  const year = date.getFullYear();
  const time = date.getHours();
  const month = date.getMonth();
  const minutes = date.getMinutes();

  const classTime =
    time >= 12
      ? `${time === 12 ? time : time - 12}:${minutes > 0 ? minutes : '00'} PM`
      : `${time}:${minutes > 0 ? minutes : '00'} AM`;

  return `${classDate} ${months[month]} ${year} at ${classTime}`;
};

const DemoWaiting = ({timeLeft}) => {
  const {demoData} = useSelector(state => state.joinDemo);

  const {localLang} = i18nContext();

  if (!demoData) return;

  const {demoDate} = demoData;
  const seconds = demoDate._seconds;
  return (
    <View
      style={{
        width: deviceWidth * 0.9,
      }}>
      <View
        style={{
          paddingVertical: 6,
          backgroundColor: COLORS.white,
          paddingHorizontal: 8,
          borderRadius: 4,
          marginBottom: 12,
        }}>
        <TextWrapper color={COLORS.black} fs={14}>
          Your class is on{' '}
          <TextWrapper color={COLORS.black} fw="bold">
            {getClassDate(seconds)}
          </TextWrapper>
        </TextWrapper>
        <CountDown timeLeft={timeLeft} />
      </View>
      {/* <Spacer space={4} /> */}
      <UploadHandwriting demoData={demoData} />
    </View>
  );
};

export default DemoWaiting;

const styles = StyleSheet.create({
  listStyle: {
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
  features: {
    paddingVertical: 20,
  },
  feature: {
    alignItems: 'center',
    paddingVertical: 28,
    alignSelf: 'center',
    maxWidth: 300,
  },
  featureIcon: {
    width: 64,
    height: 64,
    objectFit: 'cover',
  },
  featureContent: {
    alignItems: 'center',
    marginTop: 16,
  },
});
