import {NativeModules} from 'react-native';

const {AppVersionModule} = NativeModules;

export const getCurrentAppVersion = callback =>
  AppVersionModule.getCurrentVersion(callback);
