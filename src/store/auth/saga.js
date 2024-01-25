import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  phoneAuthStart,
  phoneAuthFailed,
  setVerificationLoading,
  setConfirm,
  verifyCode,
  setFailedVerification,
  fetchUser,
  setUser,
  setIsCustomer,
  logout,
} from './reducer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/storage/local-storage-keys';
import {isValidNumber} from '../../utils/isValidNumber';
import {createLead, getCustomers} from '../../utils/api/yl.api';
import {localStorage} from '../../utils/storage/storage-provider';
import DeviceInfo from 'react-native-device-info';
import {getCurrentDeviceId} from '../../utils/deviceId';
import {navigate} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';

function* phoneAuthentication({payload: {phone}}) {
  try {
    console.log('authPhone', phone);
    if (!phone) {
      yield put(phoneAuthFailed('Enter phone number'));
      return;
    }

    const isValidPhone = isValidNumber(phone, 'IN');

    if (!isValidPhone) {
      yield put(phoneAuthFailed('Please enter a valid number'));
      return;
    }

    // yield AsyncStorage.setItem(LOCAL_KEYS.PHONE, phone);
    localStorage.set(LOCAL_KEYS.PHONE, parseInt(phone));
    localStorage.set(LOCAL_KEYS.CALLING_CODE, '+91');
    const confirmation = yield auth().signInWithPhoneNumber(`+91${phone}`);
    console.log(confirmation);
    yield put(setConfirm(confirmation));
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/too-many-requests') {
      yield put(
        phoneAuthFailed('Too many attempts, try again after some time.'),
      );
    } else {
      yield put(phoneAuthFailed('Something went wrong, try again later.'));
    }
  }
}

function* verifyCodeVerification({payload: {confirm, verificationCode}}) {
  try {
    yield confirm.confirm(verificationCode);

    const phone = localStorage.getNumber(LOCAL_KEYS.PHONE);
    const countryCode = 91;
    const courseType = 'Eng_Hw';
    const deviceUID = yield DeviceInfo.getAndroidId();
    const deviceId = yield getCurrentDeviceId();

    // yield createLead({phone, countryCode, courseType, deviceUID, deviceId});
    yield put(setVerificationLoading(false));
  } catch (error) {
    console.log(error);
    yield put(setVerificationLoading(false));
    if (error.code === 'auth/invalid-verification-code') {
      yield put(setFailedVerification('Invalid verification code.'));
    } else {
      yield put(
        setFailedVerification('Something went wrong, try again later.'),
      );
    }
  }
}

function* fetchUserSaga({payload}) {
  try {
    if (!payload) {
      return;
    }
    console.log('getting res', payload);
    const res = yield getCustomers(payload);
    // console.log("res is",res)
    const data = yield res.json();
    console.log('data is here', data?.data?.customer);
    console.log('uesrs', data?.data?.customer);
    yield put(setUser(data?.data));
  } catch (error) {
    console.log(
      'FETCH_USER_ERROR',
      'Something went wrong, try again later.',
      error.message,
    );
  }
}

// listeners
function* startAuthentication() {
  yield takeLatest(phoneAuthStart.type, phoneAuthentication);
}

function* startCodeVerification() {
  yield takeLatest(verifyCode.type, verifyCodeVerification);
}

function* fetchUserListener() {
  yield takeLatest(fetchUser.type, fetchUserSaga);
}

function* logoutFunc() {
  localStorage.clearAll();

  const currentUser = auth().currentUser;
  if (currentUser) {
    yield auth().signOut();
  }
  navigate(SCREEN_NAMES.WELCOME);
}

function* logoutUser() {
  yield takeLatest(logout, logoutFunc);
}
export function* authSaga() {
  yield all([
    call(startAuthentication),
    call(startCodeVerification),
    call(fetchUserListener),
    call(logoutUser),
  ]);
}
