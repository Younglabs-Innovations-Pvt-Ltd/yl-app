import React from 'react';
import {Image, StyleSheet, View, Dimensions} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import CountDown from '../countdown.component';
import Spacer from '../spacer.component';
import {COLORS} from '../../assets/theme/theme';
import {useSelector} from 'react-redux';

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
    time >= 12 ? `${time === 12 ? time : time - 12}:00 PM` : `${time}:00 AM`;

  return `${classDate} ${months[month]} ${year} at ${classTime}`;
};

const requirement_1 =
  '1. Please make sure that your child is ready with a pencil/pen and a notebook (4 Line Notebook or 2 line Notebook for 11+ ages) before the session';
const requirement_2 =
  '2. Laptop/Desktop/Smart phone is preferable for the session';

const {width: windowWidth} = Dimensions.get('window');

const DemoWaiting = ({timeLeft}) => {
  const {demoData} = useSelector(state => state.joinDemo);

  if (!demoData) return;

  const {demoDate} = demoData;
  const seconds = demoDate._seconds;

  return (
    <View style={{paddingVertical: 12}}>
      {/* <TextWrapper color="gray">Please wait class will start</TextWrapper> */}
      <TextWrapper color="gray" fw="600">{`Your class is on ${getClassDate(
        seconds,
      )}`}</TextWrapper>
      <CountDown timeLeft={timeLeft} />
      <Spacer space={4} />
      <TextWrapper
        color={'gray'}
        fs={
          15
        }>{`Once this timer ends Click on ENTER CLASS button (shown after timer ends)`}</TextWrapper>
      <View>
        <Spacer space={6} />
        <TextWrapper fs={20}>Requirements for class:</TextWrapper>
        <View style={styles.listStyle}>
          <View style={styles.listItem}>
            <TextWrapper fs={18}>{requirement_1}</TextWrapper>
          </View>
          <View style={styles.listItem}>
            <TextWrapper fs={18}>{requirement_2}</TextWrapper>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.features,
          {flexDirection: windowWidth > 540 ? 'row' : 'column'},
        ]}>
        <TextWrapper fs={32} fw="700" styles={{textAlign: 'center'}}>
          Course Features
        </TextWrapper>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/homework.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={24} fw="700">
              Submit Homework
            </TextWrapper>
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Submit homework and get feedback from your teacher.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/download-pdf.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={24} fw="700">
              Download Worksheets
            </TextWrapper>
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Get access to worksheets of the course and practice.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/play-recording.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={24} fw="700">
              View Recordings
            </TextWrapper>
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Watch the recordings of the classes you missed.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/calendar.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={24} fw="700">
              Reschedule Classes
            </TextWrapper>
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Won't be able to attend a class? Reschedule it.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{
              uri: 'https://www.younglabs.in/icons/customer-service.png',
            }}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={24} fw="700">
              Customer Support
            </TextWrapper>
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Facing any issues? Our customer support team is always there to
              help you.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/certificate.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={24} fw="700">
              Certificate of Completion
            </TextWrapper>
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Get a certificate of completion after completing the course
            </TextWrapper>
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
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: 16,
  },
  feature: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureIcon: {
    width: 64,
    height: 64,
    objectFit: 'cover',
  },
  featureContent: {
    alignItems: 'center',
    marginTop: 12,
  },
});
