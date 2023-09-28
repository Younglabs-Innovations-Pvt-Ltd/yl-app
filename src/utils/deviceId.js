import messaging from '@react-native-firebase/messaging';

export const getCurrentDeviceId = async () => {
  await messaging().registerDeviceForRemoteMessages();

  return await messaging().getToken();
};
