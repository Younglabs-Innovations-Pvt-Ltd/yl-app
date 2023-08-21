import {NativeModules} from 'react-native';

const {InAppUpdate} = NativeModules;

// const eventEmitter = new NativeEventEmitter(InAppUpdate);

// eventEmitter.addListener('UpdateDownloaded', message => {
//   console.log('Update downloaded:', message);
//   // Handle the event in your JavaScript code
// });

// eventEmitter.addListener('UpdateCanceled', message => {
//   console.log('Update canceled:', message);
//   // Handle the event in your JavaScript code
// });

// eventEmitter.addListener('UpdateDenied', message => {
//   console.log('Update denied:', message);
//   // Handle the event in your JavaScript code
// });

export const checkForUpdate = () => {
  return InAppUpdate.checkForAppUpdate();
};

// export const addUpdateStatusListener = callback => {
//   return InAppUpdate.registerAppUpdateStatusCallback(callback);
// };
