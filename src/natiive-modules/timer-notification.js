import {NativeModules} from 'react-native';

const {NotificationModule} = NativeModules;

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param time Remaining time of demo class
 * @description Register timer notification on notification panel on mobiles
 */
export const registerNotificationTimer = time => {
  return NotificationModule.startNotificationTimer(time);
};

// Remove timer notification
export const removeRegisterNotificationTimer = () =>
  NotificationModule.stopForegroundService();
