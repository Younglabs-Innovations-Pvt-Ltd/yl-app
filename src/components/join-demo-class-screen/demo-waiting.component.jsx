import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import CountDown from '../countdown.component';
import Spacer from '../spacer.component';
import {COLORS} from '../../utils/constants/colors';
import {useSelector} from 'react-redux';
import {i18nContext} from '../../context/lang.context';

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
  const minutes = date.getMinutes();

  const classTime =
    time >= 12
      ? `${time === 12 ? time : time - 12}:${minutes > 0 ? minutes : '00'} PM`
      : `${time}:${minutes > 0 ? minutes : '00'} AM`;

  return `${classDate} ${months[month]} ${year} at ${classTime}`;
};

const requirement_1 =
  'Please make sure that your child is ready with a pencil/pen and a notebook (4 Line Notebook or 2 line Notebook for 11+ ages) before the session';

const DemoWaiting = ({timeLeft}) => {
  const {demoData} = useSelector(state => state.joinDemo);

  const {localLang} = i18nContext();

  if (!demoData) return;

  const {demoDate} = demoData;
  const seconds = demoDate._seconds;
  return (
    <View style={{paddingVertical: 12}}>
      <TextWrapper color="gray" fw="600">
        Your class is on{' '}
        <TextWrapper color={COLORS.black} fw="bold">
          {getClassDate(seconds)}
        </TextWrapper>
      </TextWrapper>
      <CountDown timeLeft={timeLeft} />
      <Spacer space={4} />
      <TextWrapper
        color={'gray'}
        fs={
          15
        }>{`Once this timer ends Click on ENTER CLASS button (shown after timer ends)`}</TextWrapper>
      <View>
        <Spacer space={6} />
        <TextWrapper
          fs={20}>{`${localLang.classRequirementHeading}:`}</TextWrapper>
        <View style={styles.listStyle}>
          <View style={styles.listItem}>
            <TextWrapper fs={18}>{localLang.classRequirementText}</TextWrapper>
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
