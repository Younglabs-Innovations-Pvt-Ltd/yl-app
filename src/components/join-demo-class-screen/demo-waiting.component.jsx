import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import CountDown from '../countdown.component';
import Spacer from '../spacer.component';
import {COLORS} from '../../assets/theme/theme';
import {useSelector} from 'react-redux';
import Button from '../button.component';
import Input from '../input.component';

import {SEND_CLASS_LINK_URL} from '@env';
import Icon from '../icon.component';

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
  'Please make sure that your child is ready with a pencil/pen and a notebook (4 Line Notebook or 2 line Notebook for 11+ ages) before the session';

const DemoWaiting = ({timeLeft}) => {
  const {demoData} = useSelector(state => state.joinDemo);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(demoData?.emailSent || false);

  if (!demoData) return;

  const {demoDate} = demoData;
  const seconds = demoDate._seconds;

  const sendLinkOnEmail = async () => {
    try {
      const res = await fetch(SEND_CLASS_LINK_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({bookingId: demoData.bookingId, email}),
      });

      if (res.status === 200) {
        setShow(false);
        setEmailSent(true);
      }
    } catch (error) {
      console.log('SEND_LINK_ON_EMAIL_ERROR_DEMO_WAITING', error);
    }
  };

  const handleSendLink = () => {
    if (email) {
      sendLinkOnEmail();
    } else {
      setShow(true);
    }
  };

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
        <TextWrapper fs={20}>Requirements for class:</TextWrapper>
        <View style={styles.listStyle}>
          <View style={styles.listItem}>
            <TextWrapper fs={18}>{requirement_1}</TextWrapper>
          </View>
        </View>
      </View>
      <View
        style={{
          paddingVertical: 20,
          maxWidth: 380,
          width: '100%',
          alignItems: 'center',
        }}>
        {!emailSent && (
          <TextWrapper color={COLORS.black} fs={18}>
            Want to join class on other device?
          </TextWrapper>
        )}
        <Spacer space={4} />
        {show && (
          <>
            <Input
              placeholder="Enter your email"
              inputMode="email"
              value={email}
              onChangeText={e => setEmail(e)}
            />
            <Spacer />
          </>
        )}
        {!emailSent ? (
          <Button bg={COLORS.pgreen} rounded={4} onPress={handleSendLink}>
            <TextWrapper fs={17} fw="700" color={COLORS.white}>
              {'Get class link on email'}
            </TextWrapper>
          </Button>
        ) : (
          <View
            style={{
              width: '100%',
              height: 48,
              paddingVertical: 6,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.pgreen,
              borderRadius: 4,
            }}>
            <TextWrapper
              fs={16}
              fw="700"
              color={COLORS.white}
              styles={{marginRight: 4}}>
              Class link shared on your email
            </TextWrapper>
            <Icon name="mail-outline" size={24} color={COLORS.white} />
          </View>
        )}
      </View>
      <View style={[styles.features]}>
        <TextWrapper fs={28} styles={{textAlign: 'center'}}>
          Course Features
        </TextWrapper>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/homework.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={18} fw="700">
              Submit Homework
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Submit homework and get feedback from your teacher.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{
              uri: 'https://www.younglabs.in/icons/download-pdf.png',
            }}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={18} fw="700">
              Download Worksheets
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              Get access to worksheets of the course and practice.
            </TextWrapper>
          </View>
        </View>
        <View style={styles.feature}>
          <Image
            source={{
              uri: 'https://www.younglabs.in/icons/play-recording.png',
            }}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={18} fw="700">
              View Recordings
            </TextWrapper>
            <Spacer space={4} />
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
            <TextWrapper fs={18} fw="700">
              Reschedule Classes
            </TextWrapper>
            <Spacer space={4} />
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
            <TextWrapper fs={18} fw="700">
              Customer Support
            </TextWrapper>
            <Spacer space={4} />
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
            <TextWrapper fs={18} fw="700">
              Certificate of Completion
            </TextWrapper>
            <Spacer space={4} />
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
