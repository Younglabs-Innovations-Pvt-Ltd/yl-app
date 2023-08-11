import React, {useEffect, useState} from 'react';
import {Linking, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {Provider} from 'react-redux';

import {store} from './src/store/store';

import SplashScreen from 'react-native-splash-screen';

// Native mmodules
import {initZoomSdk} from './src/natiive-modules/zoom-modules';

// Screens
import WelcomeScreen from './src/screens/welcome-screen';
import OnBoardingScreen from './src/screens/on-boarding-screen';
import BookDemoFormScreen from './src/screens/book-demo-form.screen';
import BookDemoSlotsScreen from './src/screens/book-demo-slots.screen';
import MainScreen from './src/screens/main-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTS} from './src/assets/theme/theme';

const Stack = createStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Splash Screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Initialize Zoom
  useEffect(() => {
    const initializeZoom = async () => {
      try {
        const res = await initZoomSdk();
        if (process.env.NODE_ENV !== 'production') {
          ToastAndroid.showWithGravity(
            res,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
      } catch (error) {
        console.log('Zoom initialize error', error);
      }
    };

    initializeZoom();
  }, []);

  // Handle redirect url (Deep Link)
  useEffect(() => {
    const handleRedirectUrl = url => {
      if (!url) {
        return;
      }

      const appPackage = 'com.younglabs';
      if (url.includes('openStore=true')) {
        Linking.openURL(`market://details?id=${appPackage}`);
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
    const checkPhone = async () => {
      try {
        setLoading(true);
        const phone = await AsyncStorage.getItem('phone');
        const bookingId = await AsyncStorage.getItem('bookingid');

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

    checkPhone();
  }, []);

  if (loading) return null;

  return (
    <Provider store={store}>
      <NavigationContainer>
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
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
          initialRouteName={isPhone || bookingId ? 'Main' : 'Welcome'}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
            initialParams={{bookingId}}
          />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen
            name="BookDemoForm"
            component={BookDemoFormScreen}
            options={{
              title: 'Book Free Handwriting Class',
            }}
          />
          <Stack.Screen
            name="BookDemoSlots"
            component={BookDemoSlotsScreen}
            options={{title: 'Book Free Handwriting Class'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
