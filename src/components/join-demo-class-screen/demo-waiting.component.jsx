import React from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
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

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

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
    <View className="flex-row items-center p-1">
      {/* <TextWrapper fs={14} className="text-white">
          Your class is on{' '}

          <TextWrapper className="text-white font-bold" fw="bold">
            {getClassDate(seconds)}
          </TextWrapper>

        </TextWrapper> */}

      {/* <CountDown timeLeft={timeLeft} /> */}

      <View className="flex-col w-[75%]">
        <Text className="text-xs text-white">
          Your First free handwriting class starts in
        </Text>
        <View className="flex-row mt-1">
          <CountDownTimer timeLeft={timeLeft} />
        </View>
      </View>

      <View className="w-[25%]">
        <UploadHandwriting demoData={demoData} />
      </View>
    </View>
  );
};

export default DemoWaiting;

const CountDownTimer = ({timeLeft}) => {
  const {darkMode, bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  return Object.entries(timeLeft)
    .filter(entry => entry[0] !== 'remainingTime')
    .map(time => {
      const label = time[0];
      const value = time[1];
      const updatedLabel = label.slice(0, 1).toUpperCase() + label.slice(1);

      return (
        <View
          key={label}
          style={[]}
          className="flex-col rounded-md bg-white mr-1 w-[60px] items-center justify-center">
          <Text className="text-gray-700 font-semibold text-[18px] text-center">
            {zeroPrefix(value)}
          </Text>
          <Text className="text-center text-[12px]">{updatedLabel}</Text>
        </View>
      );
    });
};

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
