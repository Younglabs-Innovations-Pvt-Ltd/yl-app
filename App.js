import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import {store} from './src/store/store';

import SplashScreen from 'react-native-splash-screen';
import {SENTRY_DSN} from '@env';
import {LOCAL_KEYS} from './src/utils/constants/local-keys';

// Native mmodules
import {checkForUpdate} from './src/natiive-modules/inapp-update';
// import {getCurrentAppVersion} from './src/natiive-modules/app-version';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTS} from './src/utils/constants/fonts';
import {SCREEN_NAMES} from './src/utils/constants/screen-names';

// Screens
import WelcomeScreen from './src/screens/welcome-screen';
import OnBoardingScreen from './src/screens/on-boarding-screen';
import BookDemoFormScreen from './src/screens/book-demo-form.screen';
import BookDemoSlotsScreen from './src/screens/book-demo-slots.screen';
import MainScreen from './src/screens/main-screen';
import CourseDetails from './src/screens/course-details.screen';

import * as Sentry from '@sentry/react-native';
import {navigationRef} from './src/navigationRef';

Sentry.init({
  dsn: SENTRY_DSN,
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

  // Get current app version
  // useEffect(() => {
  //   getCurrentAppVersion(data => {
  //     console.log(data);

  //     const {versionCode} = data;
  //   });
  // }, []);

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

  if (loading) return null;

  // UI Constants
  let initialRouteName = SCREEN_NAMES.WELCOME;

  if (isPhone || bookingId) {
    initialRouteName = SCREEN_NAMES.MAIN;
  }

  return (
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
            name={SCREEN_NAMES.COURSE_DETAILS}
            component={CourseDetails}
            options={{
              // headerStyle: {elevation: 0},
              headerTitle: 'Course Detail',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default Sentry.wrap(App);
