import React, {useEffect, useState} from 'react';
import {Linking, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {I18NProvider} from './src/context/lang.context';

import {Provider} from 'react-redux';
import {store} from './src/store/store';

import SplashScreen from 'react-native-splash-screen';
import {SENTRY_DSN} from '@env';
import {LOCAL_KEYS} from './src/utils/constants/local-keys';

// Notification Permissions
import {request, PERMISSIONS} from 'react-native-permissions';

// Native mmodules
import {checkForUpdate} from './src/natiive-modules/inapp-update';
// import {getCurrentAppVersion} from './src/natiive-modules/app-version';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTS} from './src/utils/constants/fonts';
import {SCREEN_NAMES} from './src/utils/constants/screen-names';

// Snackbar
import Snackbar from 'react-native-snackbar';

// Screens
import WelcomeScreen from './src/screens/welcome-screen';
import OnBoardingScreen from './src/screens/on-boarding-screen';
import BookDemoFormScreen from './src/screens/book-demo-form.screen';
import BookDemoSlotsScreen from './src/screens/book-demo-slots.screen';
import MainScreen from './src/screens/main-screen';
import CourseDetails from './src/screens/course-details.screen';
import Home from './src/screens/Home.screen';
import Payment from './src/screens/payment.screen';

import * as Sentry from '@sentry/react-native';
import {navigationRef} from './src/navigationRef';

import {COLORS} from './src/utils/constants/colors';
import {getCurrentDeviceId} from './src/utils/deviceId';
import {storeDeviceId} from './src/utils/api/yl.api';
import {NetworkProvider} from './src/context/network.state';

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
});

const Stack = createStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Splash Screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Check for app update
  useEffect(() => {
    checkForUpdate();
  }, []);

  // Handle redirect url (Deep Link)
  useEffect(() => {
    const handleRedirectUrl = url => {
      if (!url) {
        return;
      }

      const parseUrl = url.split('?')[1];
      const parseBookingId = parseUrl.split('=')[1];
      const bookingId = parseBookingId.replace(/#/g, '');

      setBookingId(bookingId);
    };

    Linking.getInitialURL()
      .then(handleRedirectUrl)
      .catch(err => console.log(err));
  }, []);

  // Check if user already logged in
  // then redirect to home screen
  useEffect(() => {
    const isUserAlreadyLoggedIn = async () => {
      try {
        setLoading(true);
        const phone = await AsyncStorage.getItem(LOCAL_KEYS.PHONE);
        const bookingId = await AsyncStorage.getItem(LOCAL_KEYS.BOOKING_ID);

        if (phone) {
          setIsPhone(true);
        }

        if (bookingId) {
          setBookingId(bookingId);
        }
        setLoading(false);
      } catch (error) {
        console.log('CHECK_PHONE_ASYNC_STORAGE_ERROR_APP', error);
      }
    };

    isUserAlreadyLoggedIn();
  }, []);

  // Save Device id
  useEffect(() => {
    saveDeviceId();
  }, []);

  const saveDeviceId = async () => {
    try {
      const token = await getCurrentDeviceId();

      const deviceId = await AsyncStorage.getItem(LOCAL_KEYS.DEVICE_ID);

      if (!deviceId) {
        const response = await storeDeviceId(token);

        if (response.status === 200) {
          await AsyncStorage.setItem(LOCAL_KEYS.DEVICE_ID, 'true');
        }
      }
    } catch (error) {
      console.log('DEVICE_ID_ERROR_APP=', error);
    }
  };

  // Request for Notification permission
  useEffect(() => {
    requestPermissions();
  }, []);

  // Request for Notifications permission to above android 13 or above
  const requestPermissions = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

      if (result === 'denied') {
        Alert.alert(
          'Permission required',
          'To be able to update for events and offers, please grant permission.',
          [
            {
              text: 'OK',
              onPress: () => requestPermissions(),
            },
          ],
        );
      } else if (result === 'blocked') {
        Snackbar.show({
          text: 'Notification permission blocked, go to app setting to grant it.',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'GRANT',
            textColor: COLORS.white,
            onPress: openAppSetting,
          },
        });
      }
    } catch (error) {
      console.log('REQUEST_NOTIFICATION_PERMISSION_ERROR=', error);
    }
  };

  const openAppSetting = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.log('OPEN_SETTING_ERROR=', error);
    }
  };

  if (loading) return null;

  // UI Constants
  let initialRouteName = SCREEN_NAMES.WELCOME;

  if (isPhone || bookingId) {
    initialRouteName = SCREEN_NAMES.MAIN;
  }

  return (
    // Provider for language
    <I18NProvider>
      {/* Provider for checking internet state */}
      <NetworkProvider>
        {/* Provider for redux store */}
        <Provider store={store}>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              screenOptions={{
                // headerShown: false,
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eaeaea',
                },
                headerTitleStyle: {
                  fontSize: 18,
                  fontFamily: FONTS.gelasio_semibold,
                  fontWeight: '700',
                },
                cardStyle: {backgroundColor: '#fff'},
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
              initialRouteName={initialRouteName}>
              <Stack.Screen
                name={SCREEN_NAMES.WELCOME}
                component={WelcomeScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name={SCREEN_NAMES.MAIN}
                component={MainScreen}
                options={{headerShown: false}}
                initialParams={{bookingId}}
              />
              <Stack.Screen
                name={SCREEN_NAMES.ON_BOARDING}
                component={OnBoardingScreen}
              />
              <Stack.Screen
                name={SCREEN_NAMES.BOOK_DEMO_FORM}
                component={BookDemoFormScreen}
                options={{
                  title: 'Book Free Handwriting Class',
                }}
              />
              <Stack.Screen
                name={SCREEN_NAMES.BOOK_DEMO_SLOTS}
                component={BookDemoSlotsScreen}
                options={{title: 'Book Free Handwriting Class'}}
              />
              <Stack.Screen
                name={'home'}
                component={Home}
                // options={{title: 'Book Free Handwriting Class'}}
              />
              <Stack.Screen
                name={SCREEN_NAMES.COURSE_DETAILS}
                component={CourseDetails}
                options={{
                  // headerStyle: {elevation: 0},
                  headerTitle: 'Course Detail',
                }}
              />
              <Stack.Screen
                name={SCREEN_NAMES.PAYMENT}
                component={Payment}
                options={{
                  headerTitle: 'Checkout',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </NetworkProvider>
    </I18NProvider>
  );
}

export default Sentry.wrap(App);
