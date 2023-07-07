import 'react-native-gesture-handler';
import {useEffect, useState} from 'react';
import {StatusBar, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DemoClassScreen from './src/screens/demo-class.screen';

const Stack = createStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [queryDataFromUrl, setQueryDataFromUrl] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#3CCF4E');
  }, []);

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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#fff'},
        }}>
        <Stack.Screen
          name="DemoClass"
          component={DemoClassScreen}
          initialParams={{data: queryDataFromUrl}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
