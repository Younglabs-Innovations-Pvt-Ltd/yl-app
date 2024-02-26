import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../store/auth/selector';
import TextWrapper from '../components/text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import Icon from '../components/icon.component';
import Spacer from '../components/spacer.component';
import {logout} from '../store/auth/reducer';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

const INITIAL_COUNT = 10;

const PaymentSuccess = () => {
  const {user} = useSelector(authSelector);
  const [count, setCount] = useState(INITIAL_COUNT);

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(pre => {
        if (pre === 0) {
          clearInterval(interval);
          return 0;
        }

        return pre - 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      // logout and navigate to signup screen
      dispatch(
        logout({
          route: SCREEN_NAMES.EMAIL_LOGIN,
          params: {email: user.email, password: `younglabs${user.leadId}`},
        }),
      );
    }
  }, [count]);

  const showSnack = () => {
    Snackbar.show({
      text: 'Copied.',
      textColor: COLORS.white,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const copyEmail = () => {
    Clipboard.setString(user.email);
    showSnack();
  };
  const copyPassword = () => {
    Clipboard.setString(`younglabs${user?.leadId}`);
    showSnack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.checkmark}>
          <Icon name="checkmark-done" size={60} color={COLORS.white} />
        </View>
        <Spacer />
        <TextWrapper>Payment Successful</TextWrapper>
        <Spacer space={4} />
        <TextWrapper>{`You will be logout automatically in ${count}`}</TextWrapper>
        <View style={{marginTop: 8, alignItems: 'center'}}>
          <TextWrapper>Copy and login with these credentials</TextWrapper>
          <Spacer space={4} />
          <View style={styles.row}>
            <TextWrapper>{`Email: ${user?.email}`}</TextWrapper>
            <Icon
              name="copy"
              size={26}
              color={COLORS.black}
              onPress={copyEmail}
            />
          </View>
          <Spacer space={4} />
          <View style={styles.row}>
            <TextWrapper>{`Password: younglabs${user?.leadId}`}</TextWrapper>
            <Icon
              name="copy"
              size={26}
              color={COLORS.black}
              onPress={copyPassword}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  checkmark: {
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: COLORS.pgreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
