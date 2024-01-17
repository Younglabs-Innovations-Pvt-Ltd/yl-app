import React, {useState} from 'react';
import {StyleSheet, Pressable, View, ActivityIndicator} from 'react-native';
import Input from './input.component';
import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
import {COLORS} from '../utils/constants/colors';
import {BASE_URL, SEND_CLASS_LINK_URL} from '@env';

const Email = ({demoData}) => {
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(demoData?.emailSent || false);

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

      console.log('emailRes', await res.json());

      if (res.status === 200) {
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

  return (
    <>
      {!emailSent ? (
        <View style={{marginTop: 20, width: '100%', alignItems: 'center'}}>
          <TextWrapper color={COLORS.black} fs={20}>
            Want to join class on other device?
          </TextWrapper>
          <Input
            placeholder="Enter your email"
            inputMode="email"
            value={email}
            onChangeText={onChangeEmail}
            autoCapitalize="none"
          />
          {errorMessage && (
            <TextWrapper
              fs={14}
              color={COLORS.pred}
              styles={{alignSelf: 'flex-start'}}>
              {errorMessage}
            </TextWrapper>
          )}
          <Spacer />
          <Pressable
            style={({pressed}) => [styles.button, {opacity: pressed ? 0.8 : 1}]}
            onPress={sendLinkOnEmail}>
            <TextWrapper fs={17} color={COLORS.white}>
              Get class link on email
            </TextWrapper>
            {emailLoading && (
              <ActivityIndicator
                size={'small'}
                color={COLORS.white}
                style={{marginLeft: 4}}
              />
            )}
          </Pressable>
        </View>
      ) : (
        <View>
          <TextWrapper fs={24} styles={{textAlign: 'center'}}>
            Class link shared on your email
          </TextWrapper>
        </View>
      )}
    </>
  );
};

export default Email;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pblue,
    borderRadius: 8,
  },
});
