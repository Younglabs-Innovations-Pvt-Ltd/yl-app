import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from './local-storage-keys';

// Get current local language of app
export const getCurrentLocalLangAsync = async () =>
  await AsyncStorage.getItem(LOCAL_KEYS.LANGUAGE_KEY);

// Set current local language
export const setCurrentLocalLangAsync = async lang =>
  await AsyncStorage.setItem(LOCAL_KEYS.LANGUAGE_KEY, lang);

// Get phone number of user
export const getLocalPhoneAsync = async () =>
  await AsyncStorage.getItem(LOCAL_KEYS.PHONE);

// Set phone number of user
export const setLocalPhoneAsync = async phone =>
  await AsyncStorage.setItem(LOCAL_KEYS.PHONE, phone);

// Get country calling code
export const getCountryCallingCodeAsync = async () =>
  await AsyncStorage.getItem(LOCAL_KEYS.CALLING_CODE);

// Get country calling code
export const setCountryCallingCodeAsync = async callingCode =>
  await AsyncStorage.setItem(LOCAL_KEYS.CALLING_CODE, callingCode);
