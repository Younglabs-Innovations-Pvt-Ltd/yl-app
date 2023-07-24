import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import {StatusBar, Linking, ToastAndroid} from 'react-native';
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
import ReScheduleScreen from './src/screens/Re-schedule-class.screen';
import OnBoardingScreen from './src/screens/on-boarding-screen';
import BookDemoFormScreen from './src/screens/book-demo-form.screen';
import BookDemoSlotsScreen from './src/screens/book-demo-slots.screen';
import MainScreen from './src/screens/main-screen';

import {COLORS} from './src/assets/theme/theme';

const Stack = createStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [queryDataFromUrl, setQueryDataFromUrl] = useState(null);

  // Style status bar
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(COLORS.pgreen);
  }, []);

  // Splash Screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Initialize Zoom
  useEffect(() => {
    const initializeZoom = async () => {
      try {
        const res = await initZoomSdk();
        ToastAndroid.showWithGravity(
          JSON.stringify(res),
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log(res);
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
        setLoading(false);
        return;
      }

      const appPackage = 'com.younglabs';
      if (url.includes('openStore=true')) {
        Linking.openURL(`market://details?id=${appPackage}`);
      }

      let urlParams = {};

      const parseUrl = url.split('?')[1];
      const parseBookingId = parseUrl.split('=')[1];
      const bookingId = parseBookingId.replace(/#/g, '');
      urlParams.demoId = bookingId;

      setQueryDataFromUrl(urlParams);
      setLoading(false);
    };

    Linking.getInitialURL()
      .then(handleRedirectUrl)
      .catch(err => console.log(err));
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
            cardStyle: {backgroundColor: '#fff'},
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            initialParams={{
              data: {queryData: queryDataFromUrl},
            }}
            options={{headerShown: false}}
          />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Reschedule" component={ReScheduleScreen} />
          <Stack.Screen
            name="BookDemoForm"
            component={BookDemoFormScreen}
            options={{title: 'Book Class'}}
          />
          <Stack.Screen
            name="BookDemoSlots"
            component={BookDemoSlotsScreen}
            options={{title: 'Book Class'}}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
