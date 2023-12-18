import messaging from '@react-native-firebase/messaging';
import {storeDeviceId} from './api/yl.api';

export const getCurrentDeviceId = async () => {
  await messaging().registerDeviceForRemoteMessages();

  return await messaging().getToken();
};

export const saveDeviceId = async ({phone}) => {
  try {
    const token = await getCurrentDeviceId();

    const response = await storeDeviceId({deviceId: token, phone});
    const data = await response.json();
    console.log('tokenData mobile', data);
  } catch (error) {
    console.log('DEVICE_ID_ERROR_APP=', error);
  }
};
