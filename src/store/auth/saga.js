import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  phoneAuthStart,
  phoneAuthFailed,
  setVerificationLoading,
  setConfirm,
  verifyCode,
} from './reducer';

function* phoneAuthentication({payload: {phone}}) {
  try {
    const confirmation = yield auth().signInWithPhoneNumber(`+91${phone}`);
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
      yield put(phoneAuthFailed('Invalid verification code.'));
    } else {
      yield put(phoneAuthFailed(error.message));
    }
  }
}

// listeners
function* startAuthentication() {
  yield takeLatest(phoneAuthStart.type, phoneAuthentication);
}

function* startCodeVerification() {
  yield takeLatest(verifyCode.type, verifyCodeVerification);
}

export function* authSaga() {
  yield all([call(startAuthentication), call(startCodeVerification)]);
}
