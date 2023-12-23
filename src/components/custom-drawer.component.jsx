import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Linking,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
// import {setToInitialState} from '../store/join-demo/join-demo.reducer';

import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import Icon from '../components/icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {COLORS} from '../utils/constants/colors';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeRegisterNotificationTimer} from '../natiive-modules/timer-notification';

import {cancleNotifications} from '../utils/notifications';
// import Share from 'react-native-share';

import {i18nContext} from '../context/lang.context';
import {authSelector} from '../store/auth/selector';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import auth from '@react-native-firebase/auth';
import {logout} from '../store/auth/reducer';
import {localStorage} from '../utils/storage/storage-provider';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {FONTS} from '../utils/constants/fonts';

const WEBSITE_URL = 'https://www.younglabs.in/';

const CustomDrawerContent = ({navigation, ...props}) => {
  const {localLang} = i18nContext();
  const dispatch = useDispatch();
  const {bookingDetails, demoPhoneNumber} = useSelector(joinDemoSelector);
  const {user} = useSelector(authSelector);
  const windowDimensions = useWindowDimensions();

  // if (!bookingDetails) return null;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // await AsyncStorage.removeItem(LOCAL_KEYS.PHONE);
      // await AsyncStorage.removeItem(LOCAL_KEYS.COUNTDOWN_NOTIFICATION);
      // await AsyncStorage.removeItem(LOCAL_KEYS.BOOKING_ID);
      // await AsyncStorage.removeItem(LOCAL_KEYS.CALLING_CODE);
      // await AsyncStorage.removeItem(LOCAL_KEYS.ACS_TOKEN_EXPIRE);
      // await AsyncStorage.removeItem(LOCAL_KEYS.ACS_TOKEN);
      // await AsyncStorage.removeItem(LOCAL_KEYS.NMI);
      // await AsyncStorage.removeItem(LOCAL_KEYS.SAVE_ATTENDED);
      // await AsyncStorage.removeItem(LOCAL_KEYS.IS_RATED);
      // await AsyncStorage.removeItem(LOCAL_KEYS.SAVE_ATTENDED);
      await cancleNotifications();

      // const keys = await AsyncStorage.getAllKeys();
      // console.log('keys: ', keys);
      // await AsyncStorage.multiRemove(keys);

      localStorage.clearAll();

      removeRegisterNotificationTimer();

      dispatch(logout());
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      });

      navigation.dispatch(resetAction);
    } catch (error) {
      console.log('CHANGE_NUMBER_ERROR', error);
    }
  };

  const openInstagram = async () => {
    try {
      const instagram_url = 'https://www.instagram.com/younglabs.in/';
      await Linking.openURL(instagram_url);
    } catch (error) {
      console.log('OPEN_INSTAGRAM_URL_ERROR', error);
    }
  };

  const openFacebook = async () => {
    try {
      const facebook_url = 'https://www.facebook.com/Younglabs/';
      await Linking.openURL(facebook_url);
    } catch (error) {
      console.log('OPEN_INSTAGRAM_URL_ERROR', error);
    }
  };

  const openWhatsapp = async () => {
    let whatappUrl = '';
    const phoneNumber = '+919289029696';

    if (Platform.OS === 'android') {
      whatappUrl = `whatsapp://send?phone=${phoneNumber}&text=Hello, I need more info about the full course`;
    } else if (Platform.OS === 'ios') {
      whatappUrl = `whatsapp://wa.me/${phoneNumber}&text=Hello, I need more info about the full course`;
    }
    try {
      await Linking.openURL(whatappUrl);
    } catch (error) {
      console.log('join demo screen whatsapp redirect error', error);
    }
  };

  const redirectToWebsite = async () => {
    try {
      await Linking.openURL(WEBSITE_URL);
    } catch (error) {
      console.log('OPEN_ABOUT_US_URL_ERROR', error);
    }
  };

  const fullName = bookingDetails?.parentName
    ? bookingDetails.parentName.slice(0, 1).toUpperCase() +
      bookingDetails.parentName.slice(1)
    : '';

  // const shareApp = async () => {
  //   const message =
  //     'Book a free english handwriting class for your child conducted by experts.';
  //   const url = 'https://play.google.com/store/apps/details?id=com.younglabs';
  //   try {
  //     await Share.open({
  //       title: 'Younglabs',
  //       message: `${message} \n Download now: ${url}`,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const copyCredentials = cred => {
    Clipboard.setString(cred);
    Snackbar.show({
      text: 'Copied.',
      textColor: COLORS.white,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const rescheduleClass = () => {
    navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {
      formFields: {
        childAge: bookingDetails?.childAge,
        parentName: bookingDetails?.parentName,
        phone: bookingDetails?.phone,
        childName: bookingDetails?.childName,
      },
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={[
          styles.parentContainer,
          {height: windowDimensions.height - 94},
        ]}>
        <View style={{flex: 2}}>
          <View style={styles.drawerHeader}>
            <TextWrapper fs={28} numberOfLines={1}>
              {fullName || 'Guest'}
            </TextWrapper>
            <TextWrapper>{user?.phone}</TextWrapper>
          </View>
          {user && user?.customer === 'yes' && (
            <View style={{paddingVertical: 8, paddingHorizontal: 8}}>
              <TextWrapper fs={18.5}>Credentials</TextWrapper>
              <Spacer space={2} />
              <View>
                <TextWrapper fs={17} fw="700">
                  Email:
                </TextWrapper>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <TextWrapper fs={16.5}>{user?.email}</TextWrapper>
                  <Icon
                    name="copy-outline"
                    size={24}
                    color={'gray'}
                    onPress={() => copyCredentials(user?.email)}
                  />
                </View>
              </View>
              <View>
                <TextWrapper fs={17} fw="700">
                  Password:
                </TextWrapper>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <TextWrapper
                    fs={16.5}>{`younglabs${user?.leadId}`}</TextWrapper>
                  <Icon
                    name="copy-outline"
                    size={24}
                    color={'gray'}
                    onPress={() => copyCredentials(`younglabs${user?.leadId}`)}
                  />
                </View>
              </View>
            </View>
          )}
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TextWrapper fs={20} styles={{textAlign: 'center'}}>
              {localLang.drawerWebsiteText}
            </TextWrapper>
            <Spacer space={4} />
            <Pressable
              style={({pressed}) => [
                styles.drawerButton,
                {backgroundColor: pressed ? '#eee' : 'transparent'},
              ]}
              onPress={redirectToWebsite}>
              <MIcon name="web" size={24} color={COLORS.black} />
              <TextWrapper fs={18} styles={{letterSpacing: 1.02}}>
                {localLang.drawerWebsiteButtonText}
              </TextWrapper>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'flex-end',
          }}>
          {/* <Pressable
            style={({pressed}) => [
              styles.btnDrawer,
              {
                backgroundColor: pressed ? '#eaeaea' : 'transparent',
                justifyContent: 'flex-start',
              },
            ]}
            onPress={shareApp}>
            <Icon name="share-social-outline" size={20} color={COLORS.black} />
            <TextWrapper
              color={COLORS.black}
              fs={16.5}
              styles={{marginLeft: 8}}>
              {localLang.shareButtonText}
            </TextWrapper>
          </Pressable> */}
          <Pressable
            style={({pressed}) => [
              styles.btnDrawer,
              {
                backgroundColor: pressed ? '#eaeaea' : 'transparent',
                justifyContent: 'flex-start',
              },
            ]}
            onPress={rescheduleClass}>
            <TextWrapper color={COLORS.black} ff={FONTS.signika_medium}>
              Book free handwriting class
            </TextWrapper>
          </Pressable>
          <View style={styles.socialContainer}>
            <TextWrapper ff={FONTS.signika_medium}>
              {localLang.socialMediaButtonText}
            </TextWrapper>
            <View style={styles.socialMediaIconsWrapper}>
              <Pressable style={styles.btnSocialMedia} onPress={openFacebook}>
                <Icon name="logo-facebook" size={30} color="blue" />
              </Pressable>
              <Pressable style={styles.btnSocialMedia} onPress={openInstagram}>
                <Icon name="logo-instagram" size={30} color={COLORS.orange} />
              </Pressable>
              <Pressable style={styles.btnSocialMedia} onPress={openWhatsapp}>
                <Icon name="logo-whatsapp" size={30} color={COLORS.pgreen} />
              </Pressable>
            </View>
          </View>
          <View style={styles.logoutButtonWrapper}>
            <Pressable
              style={({pressed}) => [
                styles.btnDrawer,
                {backgroundColor: pressed ? '#eaeaea' : 'transparent'},
              ]}
              onPress={handleLogout}>
              <TextWrapper color={COLORS.black} ff={FONTS.signika_medium}>
                {localLang.logoutButtonText}
              </TextWrapper>
              <Icon name="log-out-outline" size={24} color={COLORS.black} />
            </Pressable>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  drawerHeader: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  btnDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
  },
  btnSocialMedia: {
    width: 36,
    height: 36,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  socialMediaIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  drawerButton: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 4,
  },
  logoutButtonWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 2,
  },
});
