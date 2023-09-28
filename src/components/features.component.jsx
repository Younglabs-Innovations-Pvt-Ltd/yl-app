import React, {useMemo, useState} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
import Input from './input.component';
import Icon from './icon.component';
import Button from './button.component';
import {COLORS} from '../utils/constants/colors';

import {BASE_URL, SEND_CLASS_LINK_URL} from '@env';
import Spinner from './spinner.component';
import {i18nContext} from '../context/lang.context';

const Features = ({demoData}) => {
  if (!demoData) return null;
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(demoData?.emailSent || false);

  const {localLang} = i18nContext();

  const demoTime = demoData.demoDate._seconds * 1000;
  const currentTime = Date.now();

  const isDemoOver = currentTime > demoTime;

  const onChangeEmail = e => {
    setEmail(e);
  };

  const sendLinkOnEmail = async () => {
    if (!email) {
      setErrorMessage('Please enter email');
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    try {
      setEmailLoading(true);
      const res = await fetch(`${BASE_URL}${SEND_CLASS_LINK_URL}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({bookingId: demoData.bookingId, email}),
      });

      if (res.status === 200) {
        setShow(false);
        setEmailSent(true);
        setEmailLoading(false);
      }

      if (errorMessage) {
        setErrorMessage('');
      }
    } catch (error) {
      console.log('SEND_LINK_ON_EMAIL_ERROR_DEMO_WAITING', error);
      setEmailLoading(false);
    }
  };

  const handleSendLink = () => {
    if (!show) {
      setShow(true);
    } else {
      sendLinkOnEmail();
    }
  };

  // UI Constants

  // Send free class link to email
  const EMAIL_COMPONENT = useMemo(() => {
    return emailLoading ? (
      <Spinner style={{alignSelf: 'center'}} />
    ) : !isDemoOver ? (
      <>
        {!emailSent ? (
          <View style={{marginTop: 20, width: '100%', alignItems: 'center'}}>
            <TextWrapper color={COLORS.black} fs={18}>
              {localLang.sendEmailLabel}
            </TextWrapper>
            {show && (
              <Input
                placeholder="Enter your email"
                inputMode="email"
                value={email}
                onChangeText={onChangeEmail}
                autoCapitalize="none"
              />
            )}
            {errorMessage && (
              <TextWrapper
                fs={14}
                color={COLORS.pred}
                styles={{alignSelf: 'flex-start'}}>
                {errorMessage}
              </TextWrapper>
            )}
            <Spacer />
            <Button bg={COLORS.pgreen} rounded={4} onPress={handleSendLink}>
              <TextWrapper fs={17} fw="700" color={COLORS.white}>
                {localLang.sendEmailButtonText}
              </TextWrapper>
            </Button>
          </View>
        ) : (
          <View style={styles.btnSendLink}>
            <TextWrapper
              fs={16}
              fw="700"
              color={COLORS.white}
              styles={{marginRight: 4}}>
              {localLang.sendEmailInformText}
            </TextWrapper>
            <Icon name="mail-outline" size={24} color={COLORS.white} />
          </View>
        )}
      </>
    ) : null;
  }, [
    emailLoading,
    isDemoOver,
    emailSent,
    show,
    errorMessage,
    email,
    localLang.sendEmailLabel,
    localLang.sendEmailButtonText,
    localLang.sendEmailInformText,
  ]);

  return (
    <>
      <View
        style={{
          maxWidth: 380,
          width: '100%',
          alignItems: 'center',
        }}>
        {EMAIL_COMPONENT}
      </View>
      <View style={[styles.features]}>
        <TextWrapper fs={28} styles={{textAlign: 'center'}}>
          {localLang.courseFeaturesLabel}
        </TextWrapper>
        <View style={styles.feature}>
          <Image
            source={{uri: 'https://www.younglabs.in/icons/homework.png'}}
            style={styles.featureIcon}
          />
          <View style={styles.featureContent}>
            <TextWrapper fs={18} fw="700">
              {localLang.courseFeatureLabel1}
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              {localLang.courseFeatureText1}
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
              {localLang.courseFeatureLabel2}
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              {localLang.courseFeatureText2}
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
              {localLang.courseFeatureLabel3}
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              {localLang.courseFeatureText3}
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
              {localLang.courseFeatureLabel4}
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              {localLang.courseFeatureText4}
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
              {localLang.courseFeatureLabel5}
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              {localLang.courseFeatureText5}
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
              {localLang.courseFeatureLabel6}
            </TextWrapper>
            <Spacer space={4} />
            <TextWrapper fs={18} styles={{textAlign: 'center'}}>
              {localLang.courseFeatureText6}
            </TextWrapper>
          </View>
        </View>
      </View>
    </>
  );
};

export default Features;

const styles = StyleSheet.create({
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
  btnSendLink: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pgreen,
    borderRadius: 4,
  },
});
