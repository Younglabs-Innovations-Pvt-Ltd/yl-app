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
} from './reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/storage/local-storage-keys';
import {isValidNumber} from '../../utils/isValidNumber';
import {getCustomers} from '../../utils/api/yl.api';

function* phoneAuthentication({payload: {phone, country}}) {
  try {
    if (!phone) {
      yield put(phoneAuthFailed('Enter phone number'));
      return;
    }

    const isValidPhone = isValidNumber(phone, country.countryCode.cca2);

    if (!isValidPhone) {
      yield put(phoneAuthFailed('Please enter a valid number'));
      return;
    }

    yield AsyncStorage.setItem(LOCAL_KEYS.PHONE, phone);
    const confirmation = yield auth().signInWithPhoneNumber(`+91${phone}`);
    console.log(confirmation);
    yield put(setConfirm(confirmation));
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/too-many-requests') {
      yield put(phoneAuthFailed('Too many attempts, please try again later.'));
    } else {
      yield put(phoneAuthFailed(error.message));
    }
  }
}

function* verifyCodeVerification({payload: {confirm, verificationCode}}) {
  try {
    yield confirm.confirm(verificationCode);
    yield put(setVerificationLoading(false));
  } catch (error) {
    console.log(error);
    yield put(setVerificationLoading(false));
    if (error.code === 'auth/invalid-verification-code') {
      yield put(setFailedVerification('Invalid verification code.'));
    } else {
      yield put(setFailedVerification(error.message));
    }
  }
}

function* fetchUserSaga({payload: {leadId}}) {
  try {
    const res = yield getCustomers({leadId});
    const data = yield res.json();
    console.log('uesrs', data.data.customer);
    yield put(setUser(data.data));
  } catch (error) {
    console.log('FETCH_USER_ERROR', error.message);
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

export function* authSaga() {
  yield all([
    call(startAuthentication),
    call(startCodeVerification),
    call(fetchUserListener),
  ]);
}
