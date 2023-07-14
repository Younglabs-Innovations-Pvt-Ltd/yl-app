import 'react-native-gesture-handler';
import {useEffect, useState} from 'react';
import {StatusBar, Linking, ToastAndroid, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {store} from './src/store/store';

// import SplashScreen from 'react-native-splash-screen';

// Native mmodules
import {initZoomSdk} from './src/natiive-modules/zoom-modules';

// Screens
import DemoClassScreen from './src/screens/demo-class.screen';
import ReScheduleScreen from './src/screens/Re-schedule-class.screen';
import OnBoardingScreen from './src/screens/on-boarding-screen';

import {COLORS} from './src/theme/theme';

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
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     SplashScreen.hide();
  //   }
  // }, []);

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
        console.log('Not from url.');
        setLoading(false);
        return;
      }

      const appPackage = 'com.younglabs';
      if (url.includes('openStore=true')) {
        Linking.openURL(`market://details?id=${appPackage}`);
      }

      let urlParams = {};

      const parseUrl = url.split('?')[1];
      parseUrl.split('&').forEach(queryData => {
        const params = queryData.split('=');
        const queryName = params[0];
        const queryValue = params[1];
        urlParams[queryName] = queryValue;
      });

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
            headerShown: false,
            cardStyle: {backgroundColor: '#fff'},
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}>
          <Stack.Screen
            name="DemoClass"
            component={DemoClassScreen}
            initialParams={{
              data: {queryData: queryDataFromUrl},
            }}
          />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Reschedule" component={ReScheduleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
