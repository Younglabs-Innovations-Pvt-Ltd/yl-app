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
  fetchUserFormLoginDetails,
} from './reducer';
import {setChildren, setCurrentChild} from '../user/reducer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/storage/local-storage-keys';
import {isValidNumber} from '../../utils/isValidNumber';
import {createLead, getCustomers} from '../../utils/api/yl.api';
import {localStorage} from '../../utils/storage/storage-provider';
import DeviceInfo from 'react-native-device-info';
import {getCurrentDeviceId} from '../../utils/deviceId';
import {navigate} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';
import {setIsFirstTimeUser} from '../welcome-screen/reducer';

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
  console.log('in fetchUserSaga', payload);
  try {
    if (!payload) {
      return;
    }
    console.log('getting response');
    const res = yield getCustomers(payload);
    console.log('res status', res.status);
    const data = yield res.json();
    console.log('got user data', data);
    if (data?.data?.customer === 'yes') {
      console.log('sttin customer');
      yield put(setIsCustomer(true));
    }

    if (data?.data?.children && data?.data?.children?.length > 0) {
      let arr = data?.data?.children;
      let objWithBooking = arr.filter(item => item.bookingId);
      let objWithoutBooking = arr.filter(item => !item.bookingId);
      let sortedList = objWithBooking.sort((a, b) => b.bookingId - a.bookingId);
      let finalArray = [...sortedList, ...objWithoutBooking];
      console.log(
        'setting current Child',
        finalArray[0]?.name,
        finalArray[0].bookingId,
      );
      yield put(setCurrentChild(finalArray[0]));
      yield put(setChildren(finalArray));
    } else {
      yield put(setIsFirstTimeUser(true));
    }

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
  // navigate(SCREEN_NAMES.WELCOME);
}

function* logoutUser() {
  yield takeLatest(logout, logoutFunc);
}

function* fetchUserFormLoginDetailsFunc() {
  let loginDetails = localStorage.getString('loginDetails');
  console.log('fetching user...');
  loginDetails = JSON.parse(loginDetails);
  console.log('got login details: ' + loginDetails.loginType);

  if (!loginDetails) {
    yield put(logout());
  }
  // console.log('login details is', loginDetails);
  if (loginDetails.loginType === 'whatsAppNumber') {
    console.log('getting user by', loginDetails.phone);
    yield put(fetchUser({phone: loginDetails.phone}));
  } else if (loginDetails.loginType === 'customerLogin') {
    console.log('getting user by', loginDetails.email);
    yield put(fetchUser({email: loginDetails.email}));
    yield put(setIsCustomer(true));
  }
}

function* fetchUserFormLoginDetailsListner() {
  yield takeLatest(fetchUserFormLoginDetails, fetchUserFormLoginDetailsFunc);
}
export function* authSaga() {
  yield all([
    call(startAuthentication),
    call(startCodeVerification),
    call(fetchUserListener),
    call(logoutUser),
    call(fetchUserFormLoginDetailsListner),
  ]);
}
