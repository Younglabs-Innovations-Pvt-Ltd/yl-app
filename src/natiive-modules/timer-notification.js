import {NativeModules} from 'react-native';

const {NotificationModule} = NativeModules;

export const registerNotificationTimer = time => {
  return NotificationModule.startNotificationTimer(time);
};
