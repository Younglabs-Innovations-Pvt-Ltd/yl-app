import React, {useEffect, useRef, useState} from 'react';
import {Linking, Alert, ActivityIndicator, View} from 'react-native';
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
import {localStorage} from './src/utils/storage/storage-provider';
import {FONTS} from './src/utils/constants/fonts';
import {SCREEN_NAMES} from './src/utils/constants/screen-names';

// Snackbar
import Snackbar from 'react-native-snackbar';

import {ToastProvider} from 'react-native-toast-notifications';

// Screens
import WelcomeScreen from './src/screens/welcome-screen';
import OnBoardingScreen from './src/screens/on-boarding-screen';
import BookDemoFormScreen from './src/screens/book-demo-form.screen';
import BookDemoSlotsScreen from './src/screens/book-demo-slots.screen';
import MainScreen from './src/screens/main-screen';
import CourseDetails from './src/screens/course-details.screen';
import Payment from './src/screens/payment.screen';
import BatchFeeDetails from './src/screens/batch-fees-details.screen';

import * as Sentry from '@sentry/react-native';
import {navigationRef} from './src/navigationRef';

import {COLORS} from './src/utils/constants/colors';
import {NetworkProvider} from './src/context/network.state';

import auth from '@react-native-firebase/auth';

import Icon from './src/components/icon.component';
import MainWelcomeScreen from './src/screens/MainWelcomeScreen';
import CourseDetailsScreen from './src/screens/CourseDetailScreen';
import ViewAllCourses from './src/screens/ViewAllCourses';
import UserProfile from './src/screens/UserProfile';
import ScrollingAnimation from './src/screens/ScrollingAnimation';
import CustomToast from './src/components/CustomToast';
import DeviceInfo from 'react-native-device-info';
import {saveDeviceId} from './src/utils/deviceId';
import {initialize} from 'react-native-clarity';
import Signup from './src/screens/signup-screen';
import VerifyCode from './src/screens/verify-code.screen';
import EmailLogin from './src/screens/email-login-screen';

initialize('kdg30i0fnc');

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
});

const Stack = createStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState(
    SCREEN_NAMES.WELCOME,
  );

  const notificationRef = useRef({});

  // Splash Screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Check for app update
  useEffect(() => {
    checkForUpdate();
  }, []);

  useEffect(() => {
    const storeDeviceId = async () => {
      try {
        const uid = await DeviceInfo.getAndroidId();
        console.log('uid', uid);
        await saveDeviceId({phone: '', deviceUID: uid});
      } catch (error) {
        console.log('storeDeviceIdError', error.message);
      }
    };

    storeDeviceId();
  }, []);

  // check for authentication

  console.log('is user authenticated', isUserAuthenticated);

  useEffect(() => {
    requestPermissions();
    console.log('here');
    let storedUser = localStorage.getString(LOCAL_KEYS.LOGINDETAILS);
    console.log('got stored user');
    if (!storedUser) {
      console.log("did't get credentials");
      setLoading(false);
      return;
    }
    let loginDetails = JSON.parse(storedUser);
    console.log('loginDetails is', loginDetails);
    if (loginDetails.loginType === 'whatsAppNumber' && loginDetails.phone) {
      setIsUserAuthenticated(true);
      setInitialRouteName(SCREEN_NAMES.MAIN);
      setLoading(false);
    } else if (loginDetails.loginType === 'customerLogin') {
      const email = loginDetails.email;
      const password = loginDetails.password;

      if (email && password) {
        const authCustomer = async () => {
          try {
            console.log('adding');
            await auth().signInWithEmailAndPassword(email, password.trim());
            setIsUserAuthenticated(true);
            setInitialRouteName(SCREEN_NAMES.MAIN);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.log('error auth', error.message);
          }
        };
        authCustomer();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);


  // Handle redirect url (Deep Link)
  // useEffect(() => {
  //   const handleRedirectUrl = url => {
  //     if (!url) {
  //       return;
  //     }

  //     const parseUrl = url.split('?')[1];
  //     const parseBookingId = parseUrl.split('=')[1];
  //     const bookingId = parseBookingId.replace(/#/g, '');

  //     setBookingId(bookingId);
  //   };

  //   Linking.getInitialURL()
  //     .then(handleRedirectUrl)
  //     .catch(err => console.log(err));
  // }, []);

  // Request for Notification permission
  // useEffect(() => {
  //   requestPermissions();
  // }, []);

  // Request for Notifications permission to above android 13 or above
  const requestPermissions = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

      if (result === 'denied') {
        Alert.alert(
          'Permission required',
          'Request permission to share timely notifications regarding your classes.',
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

  if (loading)
    return (
      <View>
        <ActivityIndicator color={'blue'} />
      </View>
    );

  console.log('initialRouteName=', initialRouteName);
  const CustomBackButton = ({navigation}) => {
    return (
      <Icon
        name="arrow-back-outline"
        size={24}
        color={COLORS.black}
        Conti
        style={{marginLeft: 4}}
        onPress={() => navigation.goBack()}
      />
    );
  };

  console.log('notificationRef', notificationRef.current);

  return (
    // Provider for language
    <I18NProvider>
      {/* Provider for checking internet state */}
      <NetworkProvider>
        {/* Provider for redux store */}
        <Provider store={store}>
          <ToastProvider
            renderToast={toastOptions => <CustomToast toast={toastOptions} />}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator
                screenOptions={({navigation}) => ({
                  // headerShown: false,
                  headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    // borderBottomWidth: 1,
                    // borderBottomColor: '#eaeaea',
                    backgroundColor: '#fff',
                  },
                  headerTintColor: '#636165',
                  headerTitleStyle: {
                    fontSize: 18,
                    fontFamily: FONTS.gelasio_semibold,
                    fontWeight: '700',
                  },
                  headerLeft: () => (
                    <CustomBackButton navigation={navigation} />
                  ),
                  cardStyle: {backgroundColor: '#fff'},
                  cardStyleInterpolator:
                    CardStyleInterpolators.forHorizontalIOS,
                })}
                initialRouteName={initialRouteName}>
                <Stack.Screen
                  name={SCREEN_NAMES.WELCOME}
                  component={WelcomeScreen}
                  options={{headerShown: false}}
                />

                <Stack.Screen name={SCREEN_NAMES.SIGNUP} component={Signup} />
                <Stack.Screen
                  name={SCREEN_NAMES.VERIFY_CODE}
                  component={VerifyCode}
                  options={{headerTitle: 'Verify OTP'}}
                />
                <Stack.Screen
                  name={SCREEN_NAMES.EMAIL_LOGIN}
                  component={EmailLogin}
                  options={{headerTitle: 'Log in'}}
                />

                <Stack.Screen
                  name={SCREEN_NAMES.MAIN}
                  component={MainScreen}
                  options={{headerShown: false}}
                  initialParams={{data: notificationRef.current}}
                />

                {/* <Stack.Screen
                  name={'UserProfileScreen'}
                  component={UserProfile}
                  options={{headerShown: false}}
                /> */}

                <Stack.Screen
                  name="CourseDetailScreen"
                  component={CourseDetailsScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="AllCoursesScreen"
                  component={ViewAllCourses}
                  options={({route}) => ({
                    title: route.params.heading || 'All Courses',
                  })}
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
                    headerTitle: 'Course Details',
                  }}
                />
                <Stack.Screen
                  name={SCREEN_NAMES.BATCH_FEE_DETAILS}
                  component={BatchFeeDetails}
                  options={{
                    // headerStyle: {elevation: 0},
                    headerTitle: 'Batch/Fee Details',
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
          </ToastProvider>
        </Provider>
      </NetworkProvider>
    </I18NProvider>
  );
}

export default Sentry.wrap(App);
