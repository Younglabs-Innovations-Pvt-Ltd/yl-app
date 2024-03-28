import React, {useEffect, useRef, useState} from 'react';
import {Linking, Alert, ActivityIndicator, View, StatusBar, Platform} from 'react-native';
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
import {localStorage} from './src/utils/storage/storage-provider';
import {FONTS} from './src/utils/constants/fonts';
import {SCREEN_NAMES} from './src/utils/constants/screen-names';

// Snackbar
import Snackbar from 'react-native-snackbar';

import {ToastProvider} from 'react-native-toast-notifications';

// Screens
import WelcomeScreen from './src/screens/welcome-screen';
import BookDemoFormScreen from './src/screens/book-demo-form.screen';
import BookDemoSlotsScreen from './src/screens/book-demo-slots.screen';
import MainScreen from './src/screens/main-screen';
import CourseDetails from './src/screens/course-details.screen';
import Payment from './src/screens/payment.screen';
import BatchFeeDetails from './src/screens/batch-fees-details.screen';

import * as Sentry from '@sentry/react-native';
import {navigate, navigationRef} from './src/navigationRef';

import {COLORS} from './src/utils/constants/colors';
import {NetworkProvider} from './src/context/network.state';

import auth from '@react-native-firebase/auth';

import CourseDetailsScreen from './src/screens/CourseDetailScreen';
import CustomToast from './src/components/CustomToast';
import DeviceInfo from 'react-native-device-info';
import {saveDeviceId} from './src/utils/deviceId';
import {initialize} from 'react-native-clarity';
import Signup from './src/screens/signup-screen';
import EmailLogin from './src/screens/email-login-screen';
import PaymentSuccess from './src/screens/payment-success';
import CourseConductScreen from './src/screens/course-conduct-screen';
import Referral from './src/screens/referral-scree';
import MyTickets from './src/screens/mytickets-screen';
import messaging from '@react-native-firebase/messaging';
import {AndroidStyle, AndroidImportance} from '@notifee/react-native';
import {displayNotification} from './src/utils/notifications';
import PhoneLogin from './src/screens/phone-login.screen';
import { requestAPNSPermissions } from './src/utils/requestPermissions';
import { increment } from './src/natiive-modules/app-version';

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

  useEffect(() => {
    console.log("calling increment")
    increment();
  }, [])

  // Foreground notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        const data = remoteMessage.data;
        const notification = {
          android: {
            sound: 'default',
            smallIcon: 'ic_small_icon',
            importance: AndroidImportance.HIGH,
            largeIcon: require('./src/assets/images/spinner.png'),
            pressAction: {
              id: 'open_app',
              launchActivity: 'default',
            },
          },
        };

        if (data.title) {
          notification.title = data.title;
        }
        if (data.body) {
          notification.body = data.body;
        }
        if (data.image) {
          notification.android.style = {
            type: AndroidStyle.BIGPICTURE,
            picture: data.image,
            largeIcon: null,
          };
        }

        if (data.largeText) {
          notification.android.style = {
            type: AndroidStyle.BIGTEXT,
            text: data.largeText,
          };
        }

        await displayNotification(notification, 'general', 'general');
      } catch (error) {
        console.log(error);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    StatusBar.setBackgroundColor(COLORS.pblue);
    StatusBar.setBarStyle('light-content');
  }, []);

  // Splash Screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const requestAPNS = async() => {
    try {
      await requestAPNSPermissions();
    } catch (error) {
      console.log("apnsError", error)
    }
  }

  useEffect(() => {
    const storeDeviceId = async () => {
      try {
        let uid = "";
        if (Platform.OS === "android") {
          uid = await DeviceInfo.getAndroidId()
        }else if (Platform.OS === "ios") {
          uid = await DeviceInfo.getUniqueId();
        }
        console.log("uid", uid)
        await saveDeviceId({phone: '', deviceUID: uid});
      } catch (error) {
        console.log('storeDeviceIdError', error.message);
      }
    };

    storeDeviceId();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      requestPermissions();
    }else if (Platform.OS === "ios") {
      requestAPNS()
    }
    let storedUser = localStorage.getString(LOCAL_KEYS.LOGINDETAILS);
    if (!storedUser) {
      setLoading(false);
      return;
    }
    let loginDetails = JSON.parse(storedUser);
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
            const token = await auth().currentUser.getIdToken();
            if (token) {
              setIsUserAuthenticated(true);
              setInitialRouteName(SCREEN_NAMES.MAIN);
            }
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

  const handlePaymentDeepLink = ({url}) => {
    const route = url.replace(/.*?:\/\//g, '');

    console.log('route', route);

    const paymentLink = 'redirect.com.younglabs.android.payment.success';
    if (route === paymentLink) {
      navigate(SCREEN_NAMES.PAYMENT_SUCCESS);
    }
  };

  // Handle redirect url (Deep Link)
  useEffect(() => {
    // Handle deep linking
    const unsubscribe = Linking.addEventListener('url', handlePaymentDeepLink);

    return () => unsubscribe.remove();
  }, []);

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

  return (
    // Provider for language
    <I18NProvider>
      {/* Provider for redux store */}
      <Provider store={store}>
        {/* Provider for checking internet state */}
        <NetworkProvider>
          <ToastProvider
            renderToast={toastOptions => <CustomToast toast={toastOptions} />}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator
                screenOptions={({navigation}) => ({
                  // headerShown: false,
                  headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    backgroundColor: '#fff',
                  },
                  headerTintColor: '#636165',
                  headerTitleStyle: {
                    fontSize: 18,
                    fontFamily: FONTS.gelasio_semibold,
                    fontWeight: '700',
                  },
                  // headerLeft: () => (
                  //   <CustomBackButton navigation={navigation} color={COLORS.black}/>
                  // ),
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
                  name={SCREEN_NAMES.EMAIL_LOGIN}
                  component={EmailLogin}
                  options={{
                    headerTitle: 'Log in',
                    headerStyle: {backgroundColor: COLORS.pblue},
                    headerTitleStyle: {color: COLORS.white},
                    headerTintColor: COLORS.white,
                  }}
                />
                <Stack.Screen
                  name={SCREEN_NAMES.PHONELOGIN}
                  component={PhoneLogin}
                  options={{
                    headerTitle: 'Log in',
                    headerStyle: {backgroundColor: COLORS.pblue},
                    headerTitleStyle: {color: COLORS.white},
                    headerTintColor: COLORS.white,
                  }}
                />

                <Stack.Screen
                  name={SCREEN_NAMES.MAIN}
                  component={MainScreen}
                  options={{headerShown: false}}
                  initialParams={{data: notificationRef.current}}
                />
                <Stack.Screen
                  name="CourseConductScreen"
                  component={CourseConductScreen}
                  options={{headerShown: false}}
                />

                <Stack.Screen
                  name="CourseDetailScreen"
                  component={CourseDetailsScreen}
                  options={{headerShown: false}}
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
                <Stack.Screen
                  name={SCREEN_NAMES.PAYMENT_SUCCESS}
                  component={PaymentSuccess}
                  options={{
                    headerTitle: 'Success',
                  }}
                />
                <Stack.Screen
                  name={SCREEN_NAMES.REFERRAL}
                  component={Referral}
                  options={{
                    headerTitle: 'Refer & Earn',
                    headerStyle: {backgroundColor: COLORS.pblue},
                    headerTitleStyle: {color: COLORS.white},
                    headerTintColor: COLORS.white,
                  }}
                />
                <Stack.Screen
                  name={SCREEN_NAMES.MYTICKETS}
                  component={MyTickets}
                  options={{
                    headerTitle: 'My Tickets',
                    headerStyle: {backgroundColor: COLORS.pblue},
                    headerTitleStyle: {color: COLORS.white},
                    headerTintColor: COLORS.white,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </NetworkProvider>
      </Provider>
    </I18NProvider>
  );
}

export default Sentry.wrap(App);
