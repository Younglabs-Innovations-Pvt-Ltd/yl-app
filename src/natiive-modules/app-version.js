import {NativeModules} from 'react-native';

const {AppVersionModule} = NativeModules;

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param callback Callback that returns current app version
 * @description Get current version of app
 */
export const getCurrentAppVersion = callback =>
  AppVersionModule.getCurrentVersion(callback);
