/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;
  if (type === EventType.PRESS) {
    notifee.cancelNotification(notification.id);
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {});

AppRegistry.registerComponent(appName, () => App);
